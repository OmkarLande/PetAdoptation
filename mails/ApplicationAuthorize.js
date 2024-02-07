exports.ApplicationAuthorize = (fullName, email, phoneNumber, photourl, userId) => {
    return`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New Application Received</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f2f2f2;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
            }
            .header {
                background-color: #4c84ff;
                color: #fff;
                padding: 20px;
                border-radius: 10px 10px 0 0;
            }
            h1 {
                margin: 0;
            }
            .content {
                padding: 20px;
            }
            img {
                max-width: 100%;
                height: auto;
                max-height: 200px; 
            }
            ul {
                padding: 0;
                margin: 0;
                list-style-type: none;
            }
            li {
                margin-bottom: 10px;
            }
            button {
                background-color: #4c84ff;
                color: #fff;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            button:hover {
                background-color: #357ae8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Application Received</h1>
            </div>
            <div class="content">
                <p>User Details:</p>
                <ul>
                    <li><img src="${photourl}" alt="user"></li>
                    <li><strong>Name:</strong> ${fullName}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Mobile Number:</strong> ${phoneNumber}</li>
                </ul>
                
            </div>
        </div>
        <script>
            document.getElementById('approveButton').addEventListener('click', async function() {
                try {
                    const response = await fetch('https://pet-adoptation.onrender.com/user/approve/${userId}', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            // You can include additional data if necessary
                        })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        alert('User approved successfully!');
                    } else {
                        alert(data.message || 'Failed to approve user.');
                    }
                } catch (error) {
                    console.error('Error approving user:', error);
                    alert('An error occurred while approving user.');
                }
            });
        </script>
    </body>
    </html>`;
};
