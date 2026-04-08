import * as dotenv from 'dotenv';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { PDFExtract } from 'pdf.js-extract';
import { sendAlertEmail } from './mailer.js';

dotenv.config();

const firebaseConfig = {
    apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
    authDomain: "hscaterhub.firebaseapp.com",
    projectId: "hscaterhub"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const pdfExtractor = new PDFExtract();

(async () => {
    console.log("⚡ Initiating Cater2.Me Hybrid PDF+JSON Scraper Engine for HSCaterHub...");

    const crawlerDoc = await getDoc(doc(db, 'system', 'crawlers'));
    const CATER_COOKIE = crawlerDoc.exists() ? crawlerDoc.data()['Cater2.me']?.cookie : null;

    if (!CATER_COOKIE) {
        console.error("❌ CATER_COOKIE is missing from Dashboard Configuration!");
        process.exit(1);
    }

    try {
        console.log("👉 Validating Active Orders from Vendor Dashboard...");
        const res = await fetch("https://dashboard.cater2.me/vendor_app/orders", {
            headers: { "Cookie": CATER_COOKIE, "Accept": "application/json" }
        });

        if (res.status === 401 || res.status === 403 || res.redirected) {
            console.error("❌ Cater2.me authentication failed! Cookie expired.");
            await setDoc(doc(db, 'system', 'crawlers'), { 'Cater2.me': { status: 'Expired', lastRun: new Date().toLocaleString() } }, { merge: true });
            await sendAlertEmail(db, 'Cater2.me');
            process.exit(1);
        }

        const listData = await res.json();
        
        let validOrders = [];
        if (listData && listData.dates) {
            listData.dates.forEach(dateObj => {
                if (dateObj.orders && dateObj.orders.length > 0) {
                    dateObj.orders.forEach(o => {
                        if (o.guid) {
                           validOrders.push({
                               guid: o.guid,
                               original_id: o.menu ? o.menu.original_id : o.id,
                               type: o.type,
                               experience: o.experience,
                               day: dateObj.day,
                               pdf_url: o.print_order_sheet_path,
                               menu: o.menu,
                               carts_count: o.carts_count
                           });
                        }
                    });
                }
            });
        }
        
        console.log(`✅ Dynamically isolated ${validOrders.length} Cater2.Me shipments.`);

        for (let i = 0; i < validOrders.length; i++) {
            let o = validOrders[i];
            const order_Id_String = `#${o.original_id}`;
            console.log(`\n[${i+1}/${validOrders.length}] 📥 Fetching Source PDF for ${order_Id_String}...`);
            
            const pdfRes = await fetch(o.pdf_url, { headers: { "Cookie": CATER_COOKIE, "Accept": "*/*" } });
            const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
            const data = await pdfExtractor.extractBuffer(pdfBuffer, {});
            
            let text = "";
            data.pages.forEach(page => {
                let lastY = -1;
                page.content.forEach(item => {
                    if (lastY !== -1 && Math.abs(item.y - lastY) > 5) text += "\n";
                    text += item.str + " ";
                    lastY = item.y;
                });
                text += "\n";
            });

            let contactMatch = text.match(/CONTACT:\s*(.+)/);
            let companyMatch = text.match(/COMPANY:\s*(.+)/);
            let contact = contactMatch ? contactMatch[1].trim() : "";
            let company = companyMatch ? companyMatch[1].trim() : "";
            let customerName = `${contact} (${company})`.trim();
            if (customerName === "()") customerName = "Cater2.ME User";

            let setupTimeMatch = text.match(/Set-Up Completed By:\s*(.+)/);
            let pickUpTime = setupTimeMatch ? setupTimeMatch[1].trim() : "N/A";

            let addressMatch = text.match(/ADDRESS:([\s\S]+?)DELIVERY INSTRUCTIONS:/);
            let addressArr = addressMatch ? addressMatch[1].trim().split('\n').map(l=>l.trim()).filter(l=>l) : [];
            let address = addressArr.join(', ').replace(/\s{2,}/g, ' ');

            let instructionsMatch = text.match(/DELIVERY INSTRUCTIONS:([\s\S]+?)(Order Instructions|Order Confirmation|Scheduled Order|Menu Preview)/i);
            let instructions = instructionsMatch ? instructionsMatch[1].trim().replace(/\n/g, ' - ') : "N/A";

            let mappedType = "Catering";
            let subTotalNum = 0, taxNum = 0, totalNum = 0;
            let itemsList = [];

            if (o.experience && o.experience.toLowerCase().includes('group')) {
                mappedType = "Meal Manager";
                itemsList.push({ name: "Menu TBD - Group Ordering Not Closed", amount: 1, notes: "" });
            } else {
                mappedType = "Catering";
                
                let lines = text.split('\n');
                for (let j = 0; j < lines.length; j++) {
                    let line = lines[j].trim();
                    let catMatch = /(?:ENTR[ÉeÉE]E|SIDE|SAUCE|DRESSING|APPETIZER|BEVERAGE|SERVING\s*WARE):/i.exec(line);
                    
                    if (catMatch) {
                        let catIndex = catMatch.index;
                        let beforeCat = line.substring(0, catIndex).trim();
                        let qty = 1;
                        
                        let foundNum = beforeCat.match(/(\d+)/);
                        if (foundNum) {
                            qty = parseInt(foundNum[1], 10);
                        } else {
                            for (let b = 1; b <= 3; b++) {
                                if (j - b >= 0 && /^\d+$/.test(lines[j-b].trim())) {
                                    qty = parseInt(lines[j-b].trim(), 10);
                                    break;
                                }
                            }
                        }
                        
                        let colonIndex = line.indexOf(':', catIndex);
                        let rawName = line.substring(colonIndex + 1).trim();
                        
                        let k = j + 1;
                        while (k < lines.length) {
                            let nextLine = lines[k].trim();
                            if (/(?:ENTR[ÉeÉE]E|SIDE|SAUCE|DRESSING|APPETIZER|BEVERAGE|SERVING\s*WARE):/i.test(nextLine)) break;
                            if (/^\d+\s*of\s*\d+$/i.test(nextLine)) break;
                            if (/^(?:Order Confirmation|\*|Vegetarian|QUESTIONS\?|MENU ON NEXT PAGE|MENU\s*\(\d+\s*ITEMS\)|QTY|PREPARE ALL DISHES|SERVING INSTRUCTIONS|Page|UPDATED AT|ID:|VENDOR:|ORDER DATE|Check-In)/i.test(nextLine)) break;
                            
                            rawName += " " + nextLine;
                            k++;
                        }
                        
                        let cleanName = rawName.replace(/\(\d*\s*Serv\.\)/i, '').replace(/\(\d*$/i, '').replace(/\(\d*\s*S$/i, '').trim();
                        itemsList.push({ name: cleanName, amount: qty, notes: "" });
                    }
                }
                
                if (itemsList.length === 0) {
                    itemsList.push({ name: "Finalized Managed Order Items", amount: 1, notes: "" });
                }
            }

            let nowInSF = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
            let [yStr, mStr, dStr] = o.day.split('-');
            let deliveryDateSF = new Date(Number(yStr), Number(mStr) - 1, Number(dStr)); 
            
            let thresholdSF = new Date(deliveryDateSF.getTime());
            
            if (mappedType === "Meal Manager") {
                thresholdSF.setDate(thresholdSF.getDate() - 1);
                thresholdSF.setHours(17, 0, 0, 0);
            } else {
                thresholdSF.setDate(thresholdSF.getDate() - 5);
                thresholdSF.setHours(0, 0, 0, 0);
            }
            
            let orderStatus = (nowInSF >= thresholdSF) ? "Finalized" : "New";
            let todayMidnight = new Date(nowInSF);
            todayMidnight.setHours(0,0,0,0);
            if (deliveryDateSF < todayMidnight) {
                orderStatus = "Completed";
            }

            let preTaxRaw = o.menu && o.menu.pre_tax ? String(o.menu.pre_tax).replace(/[\$,]/g, '') : "0";
            let totalRaw = o.menu && o.menu.vendor_final_with_tips ? String(o.menu.vendor_final_with_tips).replace(/[\$,]/g, '') : "0";
            
            subTotalNum = parseFloat(preTaxRaw) || 0;
            totalNum = parseFloat(totalRaw) || 0;

            let netNum = 0;
            let headcountMatch = text.match(/HEADCOUNT:\s*(\d+)/i);
            let headcount = headcountMatch ? parseInt(headcountMatch[1], 10) : 0;
            
            if (headcount === 0 && o.carts_count) {
                headcount = parseInt(o.carts_count, 10);
            }

            let hasDeliveryPassed = false;
            let nowTime = nowInSF.getTime();
            if (nowTime >= deliveryDateSF.getTime()) {
                hasDeliveryPassed = true;
            }

            if (mappedType === "Meal Manager" && !hasDeliveryPassed) {
               subTotalNum = 0;
               totalNum = 0;
               netNum = 0;
            } else {
               let commissionRate = 0;
               if (headcount >= 1 && headcount <= 20) commissionRate = 0.15;
               else if (headcount >= 21 && headcount <= 50) commissionRate = 0.20;
               else if (headcount >= 51 && headcount <= 150) commissionRate = 0.25;
               else if (headcount >= 151) commissionRate = 0.30;
               
               let commissionFee = subTotalNum * commissionRate;
               netNum = totalNum - commissionFee;
            }

            let year = String(deliveryDateSF.getFullYear());
            let month = String(deliveryDateSF.getMonth() + 1).padStart(2, '0');
            let day = String(deliveryDateSF.getDate()).padStart(2, '0');
            let formattedDate = `${year}-${month}-${day}`;

            let orderPayload = {
                id: o.original_id,
                platform: "Cater2.ME",
                customerName: customerName,
                typeOfOrder: mappedType,
                deliveryDate: formattedDate,
                deliveryTime: pickUpTime,
                deliveryMethod: "Third-Party",
                subtotal: subTotalNum,
                total: totalNum,
                netPayout: netNum,
                status: orderStatus,
                items: itemsList,
                overallNotes: instructions || "Automatically extracted via Cater2.ME headless worker."
            };

            const dbOrderId = `C2M-${o.original_id}`;
            const docRef = doc(db, 'orders', dbOrderId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && (docSnap.data().manualOverride || docSnap.data().isDeleted)) {
                console.log(`     ⏭️  Skipped (Manual Override): ${dbOrderId}`);
                continue;
            }
            await setDoc(docRef, orderPayload, { merge: true });

            console.log(`   ✅ Safely vaulted Order ${dbOrderId} [${mappedType.toUpperCase()}] mapped to -> ${pickUpTime} [${orderStatus}]`);
            await new Promise(r => setTimeout(r, 800));
        }
        
        await setDoc(doc(db, 'system', 'crawlers'), { 'Cater2.me': { status: 'Active', lastRun: new Date().toLocaleString() } }, { merge: true });
        console.log(`\n🎉 Total 100% Native Automated Extraction Complete! Data synchronized!`);
        process.exit(0);
        
    } catch(e) {
        console.error("Critical Failure: ", e);
        process.exit(1);
    }
})();
