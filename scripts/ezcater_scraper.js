import puppeteer from 'puppeteer';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
    apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
    authDomain: "hscaterhub.firebaseapp.com",
    projectId: "hscaterhub"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
    console.log("🚀 Launching Stealth Chromium for ezCater...");
    
    // Fetch cookie securely from Firebase dashboard
    const crawlerDoc = await getDoc(doc(db, 'system', 'crawlers'));
    const EZ_COOKIE = crawlerDoc.exists() ? crawlerDoc.data()['ezCater']?.cookie : null;

    if (!EZ_COOKIE) {
        console.error("❌ ezCater Cookie is missing from the Dashboard Configuration!");
        process.exit(1);
    }

    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();

    const parsedCookies = EZ_COOKIE.split(';').map(c => {
        const parts = c.trim().split('=');
        return { name: parts[0], value: parts.slice(1).join('='), domain: '.ezcater.com' };
    }).filter(c => c.name.length > 0);

    await page.setCookie(...parsedCookies);
    console.log("🔑 Injected Cookie Session. Navigating to ezManage...");

    await page.goto("https://ezmanage.ezcater.com/orders", { waitUntil: 'domcontentloaded' });

    console.log("📡 Accessing ezManage GraphQL Payload...");
    let ordersData;
    try {
        ordersData = await page.evaluate(async () => {
            const query = `query OrdersQuery($sourceTypes: [OrderSource], $startDate: DateTime, $endDate: DateTime, $catererId: ID, $personalStoreGroupId: ID, $limit: Int!, $offset: Int, $orderByField: CatererOrderSortField!, $orderByDirection: SortDirection!, $searchString: String, $filter: OrderStateFilterEnum, $marketingTypes: [Marketing!]) {\n  me {\n    id\n    catererAccount {\n      id\n      orders(\n        sourceTypes: $sourceTypes\n        startDate: $startDate\n        endDate: $endDate\n        catererId: $catererId\n        personalStoreGroupId: $personalStoreGroupId\n        offset: $offset\n        orderBy: {field: $orderByField, direction: $orderByDirection}\n        limit: $limit\n        searchString: $searchString\n        filter: $filter\n        marketingTypes: $marketingTypes\n      ) {\n        edges {\n          catererWorkflowState {\n            status\n          }\n          node {\n            id\n            orderNumber\n            submittedAt\n            event {\n              deliveryTime\n              orderType\n              timestamp\n              contact {\n               name\n              }\n            }\n            catererCart {\n              totals {\n                catererTotalDue\n                subTotal\n                total\n              }\n              foodLineItems {\n                quantity\n                name\n                specialInstructions\n              }\n            }\n            orderCustomer {\n              firstName\n              lastName\n            }\n            orderSourceType\n          }\n        }\n      }\n    }\n  }\n}`;
            
            const variables = {
                "catererId": null,
                "personalStoreGroupId": null,
                "limit": 15,
                "offset": 0,
                "orderByDirection": "DESC",
                "orderByField": "EVENT_AT",
                "sourceTypes": ["MARKETPLACE", "EZ_ORDERING", "DIRECT_ENTRY", "CLUB_SODA"]
            };

            const res = await fetch("https://ezmanage-api.ezcater.com/graphql", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify([{ operationName: "OrdersQuery", variables: variables, query: query }])
            });
            
            if (!res.ok) return { error: 'auth_failed' };
            return res.json();
        });
    } catch (e) {
        ordersData = { error: 'auth_failed' };
    }

    if (!ordersData || ordersData.error || (ordersData[0] && ordersData[0].errors)) {
        console.error("❌ ezCater authentication failed or GraphQL error!", ordersData);
        await setDoc(doc(db, 'system', 'crawlers'), { 'ezCater': { status: 'Expired', lastRun: new Date().toLocaleString() } }, { merge: true });
        await browser.close();
        process.exit(1);
    }

    const orderEdges = ordersData[0]?.data?.me?.catererAccount?.orders?.edges || [];
    console.log(`\n📦 ezCater Scraper extracted ${orderEdges.length} orders!`);

    let synced = 0;
    for (const edge of orderEdges) {
        const orderInfo = edge.node;
        const totals = orderInfo.catererCart?.totals || {};
        const catererTotalDue = totals.catererTotalDue || 0;
        const subTotal = totals.subTotal || catererTotalDue;
        const totalCharge = totals.total || catererTotalDue;
        
        const rawId = orderInfo.orderNumber;
        const dbOrderId = `EZC-${rawId}`;
        const timestampIso = orderInfo.event?.timestamp || orderInfo.submittedAt;
        const contactName = orderInfo.event?.contact?.name || 
                            `${orderInfo.orderCustomer?.firstName || ''} ${orderInfo.orderCustomer?.lastName || ''}`.trim() || 
                            "ezCater User";
        
        const rawDate = new Date(timestampIso);
        
        const pickupIso = orderInfo.event?.deliveryTime || timestampIso;
        const pickupDate = new Date(pickupIso);
        
        const sfDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(rawDate);
        const [yr, mo, dy] = sfDateStr.split('-');
        const formattedDate = `${yr}-${mo}-${dy}`;
        
        const localTimeStr = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit', hour12: true }).format(rawDate);
        const pickupTimeStr = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit', hour12: true }).format(pickupDate);

        let workflowState = edge.catererWorkflowState?.status || "accepted";
        let status = "New";
        if (workflowState.toLowerCase() === 'completed' || workflowState.toLowerCase() === 'paid') {
            status = "Completed";
        } else {
            let sfTodayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date());
            if (formattedDate < sfTodayStr) status = "Completed";
        }
        
        let typeMethod = orderInfo.event?.orderType === "THIRD_PARTY_DELIVERY" ? "Partner" : "Platform";

        let orderItems = [];
        if (orderInfo.catererCart && orderInfo.catererCart.foodLineItems) {
            orderItems = orderInfo.catererCart.foodLineItems.map(item => ({
                name: item.name,
                amount: item.quantity || 1,
                notes: item.specialInstructions || ""
            }));
        }

        let newOrder = {
            id: rawId,
            platform: "ezCater",
            customerName: contactName,
            typeOfOrder: "Catering",
            deliveryDate: formattedDate,
            deliveryTime: localTimeStr,
            deliveryMethod: typeMethod,
            pickUpTime: pickupTimeStr,
            subtotal: subTotal,
            total: totalCharge,
            netPayout: catererTotalDue,
            status: status,
            overallNotes: "Automatically extracted via ezCater headless worker.",
            items: orderItems,
            createdAt: new Date().toISOString()
        };

        const docRef = doc(db, 'orders', dbOrderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && (docSnap.data().manualOverride || docSnap.data().isDeleted)) {
            console.log(`   ⏭️ Skipped (Manual Override): ${dbOrderId}`);
            continue;
        }
        await setDoc(docRef, newOrder, { merge: true });
        console.log(`   ✅ Synced ezCater Order ${dbOrderId} (${formattedDate}) -> [${status}]`);
        synced++;
    }

    await setDoc(doc(db, 'system', 'crawlers'), { 'ezCater': { status: 'Active', lastRun: new Date().toLocaleString() } }, { merge: true });

    console.log(`\n🎉 Processed ${synced} ezCater orders. System Shutdown.`);
    await browser.close();
    process.exit(0);
})();
