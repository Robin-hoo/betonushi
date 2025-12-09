// const axios = require('axios'); 
// Actually I'll use fetch if node version supports it, or standard http. Node 18+ supports fetch.
// Let's use simple http for compatibility or check if I can use relative path imports if I'm inside the project.
// I'll assume axios is NOT installed in the root where I run this.
// I'll use standard http.

const http = require('http');

function postRequest(data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 3000, // Assuming backend runs on 3000
            path: '/api/register', // Mounted at /api in app.js
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: JSON.parse(body) });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

// Check where auth routes are mounted. Usually /api/auth or similar.
// startup file `server.js` or `app.js` needs checking.
// I'll check app.js first.

async function test() {
    try {
        console.log("Testing Registration...");
        const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;

        const data = {
            first_name: "Test",
            last_name: "User",
            email: randomEmail,
            phone: "0901234567",
            gender: "Male",
            dob: "1990-01-01",
            address: "123 Street",
            password: "Password123!",
            confirmPassword: "Password123!"
        };

        const result = await postRequest(data);
        console.log("Status:", result.status);
        console.log("Body:", result.body);

        if (result.status === 201) {
            console.log("SUCCESS: User registered.");
        } else {
            console.log("FAILURE: Unexpected status.");
        }

    } catch (err) {
        console.error("Test failed:", err);
    }
}

test();
