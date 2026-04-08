import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '../.env') });

(async () => {
    const EZ_COOKIE = process.env.EZCATER_COOKIE;
    
    // Introspect DmDelivery exactly
    const query = `
      query IntrospectDelivery {
        __type(name: "DmDelivery") {
          name
          fields {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
        __type2: __type(name: "Order") {
          name
          fields {
            name
          }
        }
      }
    `;

    try {
        const res = await fetch("https://ezmanage-api.ezcater.com/graphql", {
            method: "POST",
            headers: { 
                 "Content-Type": "application/json", 
                 "Accept": "application/json",
                 "Cookie": EZ_COOKIE
            },
            body: JSON.stringify([{ 
                operationName: "IntrospectDelivery", 
                query: query 
            }])
        });
        
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
})();
