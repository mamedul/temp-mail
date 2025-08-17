
# Temp E-mail
##  A free, secure, and anonymous temporary disposable email service.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mamedul/temp-mail/blob/main/LICENSE) &nbsp;&nbsp; [![GitHub stars](https://img.shields.io/github/stars/mamedul/temp-mail?style=social)](https://github.com/mamedul/temp-mail/stargazers) &nbsp;&nbsp; [![GitHub forks](https://img.shields.io/github/forks/mamedul/temp-mail?style=social)](https://github.com/mamedul/temp-mail/network/members) &nbsp;&nbsp; [![GitHub watchers](https://img.shields.io/github/watchers/mamedul/temp-mail?style=social)](https://github.com/mamedul/temp-mail/watchers) &nbsp;&nbsp; [![GitHub followers](https://img.shields.io/github/followers/mamedul?style=social)](https://github.com/mamedul?tab=followers)

### About the Project
Temp E-mail is a modern, responsive web application designed to protect your privacy from spam, unwanted subscriptions, and malicious attacks. It provides an instant, disposable email address without requiring any registration or personal information. This project is built as a Progressive Web App (PWA), ensuring a fast and reliable user experience, even offline.

### This service is perfect for:

- Privacy-conscious users who want to keep their main inbox clean.
- Developers and QA testers who need to test email functionality.
- Anyone needing a quick, temporary email address for a one-time task.

### Features
- **Instant Email Generation**: Get a new, temporary email address with a single click.
- **Customizable Addresses**: Create your own username and choose from a list of available domains.
- **Real-time Inbox**: Messages are received and displayed instantly.
- **PWA Functionality**: Installable on any device, works offline, and sends notifications for new emails.
- **Secure & Private**: No personal data is stored, and emails are automatically deleted.
- **Simple & Intuitive UI**: A clean, professional, and responsive user interface for a seamless experience.
- **Data Persistence**: Uses localStorage for account credentials and IndexedDB for local message storage.

### How to Use
* **Generate an Email**: Click the "Get Random Email" button for an instant address, or use the "Create Your Own" form to choose a custom username and domain.
* **Copy and Use**: Click the copy button next to your new email address to copy it to your clipboard. Use this address to sign up for any website or service.
* **Receive Emails**: Your inbox will automatically refresh to show any incoming emails in real-time. You will also receive desktop notifications for new messages.
* **Manage Emails**: Click on an email to read its full content. You can download the original source or delete the message when you're finished.

### Technology Stack
* **Frontend**: HTML5, CSS3, JavaScript
* **Styling**: Tailwind CSS for a utility-first approach to responsive design.
* **API**: ``mail.tm`` via the mailjs wrapper library.
* **Data Storage**: localStorage for account persistence and IndexedDB for message caching.
* **PWA**: Service Worker for caching and offline functionality.

### Getting Started
> To get a local copy up and running, follow these simple steps.

### Prerequisites
> You don't need to install anything. The project is a single-page HTML file with links to external libraries and is ready to be hosted.

### Installation
> Clone the repository:
```sh
git clone http://github.com/mamedul/temp-mail.git
```

> Navigate to the project directory:

```sh
cd temp-mail
```

> Open index.html in your web browser.

### Contributing
Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

### Fork the Project.

* Create your Feature Branch (```git checkout -b feature/AmazingFeature```).

* Commit your Changes (```git commit -m 'Add some AmazingFeature'```).

* Push to the Branch (```git push origin feature/AmazingFeature```).

* Open a Pull Request.

### 👨‍💻 Author & Hire
Hi! I'm [Mamedul Islam](https://mamedul.github.io/), a passionate Web Developer who builds modern web applications, E-commerce, PWAs, and fast, static, dynamic, responsive websites. Specializing in WooCommerce, Wordpress, PHP, MySQL, and modern web development. Creating exceptional digital experiences since 2017.

#### 📬 Connect With Me:
* [📱 WhatsApp](https://wa.me/8801847406830)
* [💼 Fiverr Profile](https://www.fiverr.com/mamedul)
* [👔 LinkedIn](https://www.linkedin.com/in/mamedul/)
* [💻 GitHub](https://github.com/mamedul)
* [🐦 X (Twitter)](https://www.x.com/mamedul)

I'm open for [freelance work](https://www.fiverr.com/mamedul), Woocommerce, E-commerce, Wordpress, PWA development, speed test apps, Firebase projects, websocket, PHP, MySQL and more. [Hire me](https://wa.me/8801847406830) to bring your ideas to life with clean, modern code!


### 📝 License:

This project is licensed under the [MIT License](https://mit-license.org/) — feel free to use, modify, and distribute it freely.
⭐ Don't forget to star this repo if you like it!
© 2025 [Mamedul Islam](https://mamedul.github.io/)

---

### ⭐ Show Your Support

If you find this extension useful, please consider giving it a star on GitHub! Your support helps motivate further development and improvements.

[![GitHub stars](https://img.shields.io/github/stars/mamedul/temp-mail?style=for-the-badge)](https://github.com/mamedul/temp-mail/stargazers) &nbsp; If you found this project helpful, give it a ⭐ on GitHub!

---
---
---
---


# Mailjs Installation
### Install as your own codes:

A JavaScript wrapper around the [mail.tm](https://docs.mail.tm/) api.

Probably one of the best API for creating temporary email accounts.

* Usage of our API for illegal activity is strictly prohibited.
* It is forbidden to sell programs or earn from it that exclusively uses our API (for example, creating a competing temp mail client and charging for it's usage).
* The general quota limit is 8 queries per second (QPS) per IP address.

> If your goal is to test your emails, check out [smpt.dev](https://smtp.dev/) for more tools.

**npm**
```sh
npm install @cemalgnlts/mailjs
```

**yarn**
```sh
yarn add @cemalgnlts/mailjs
```

**CDN**
```html
<!-- It is only needed to listen to new messages. -->
<script src="https://cdn.jsdelivr.net/gh/cemalgnlts/Mailjs@3.0.0/eventsource.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@cemalgnlts/mailjs@3.0.0/dist/mailjs.min.js"></script>
```

### Quickstart

* Nodejs (CommonJS)
```js 
const Mailjs = require("@cemalgnlts/mailjs");
```

* Nodejs (ESM)
```js
import Mailjs from "@cemalgnlts/mailjs";
```

* Browser 
```html
<!-- You can exlude this if not listening to events. -->
<script src="https://cdn.jsdelivr.net/gh/cemalgnlts/Mailjs@3.0.0/eventsource.min.js"></script>
<!-- Mailjs library -->
<script src="https://cdn.jsdelivr.net/npm/@cemalgnlts/mailjs@3.0.0/dist/mailjs.min.js"></script>
```

[`EventSourcePolyfill`](https://github.com/EventSource/eventsource) is only for listening to new incoming messages, see [Events](#events) title for more information. Add [`EventSourcePolyfill`](https://github.com/EventSource/eventsource) before Mailjs.


```js
const mailjs = new Mailjs();

mailjs.createOneAccount()
	.then(account => console.log(account.data));
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": {
        "username": "sfygn@powerscrews.com",
        "password": "l6xjuc5p"
    }
}
```

For more reference visit [/examples](/examples) directory.


### Documentation

Returns a Promise object after the function is called. If the request is sent correctly, `status` returns `true`.

 If it returns incorrect, the `status` will be `false` and the `message` in the data is also added.

If there is no error, `status` always returns `true`.

With `statusCode` you can access the status code returned as a result of the request. `statusCode` is only for debugging, just look at `status` to see if an error has occurred.

A successfull response example:

```json
{
  "status": true,
  "statusCode": 200,
  "message": "ok",
  "data": {}
}
```

A failed response example:

```json
{
  "status": false,
  "statusCode": 410,
  "message": "Invalid credentials.",
  "data": {}
}
```

Example use:

```js
const acc = await mailjs.createOneAccount();

// If there is a error.
if(!acc.status) {
  // Show the cause of the error.
  console.error(acc.message);

  return;
}

// If successful, access the data.
console.log(acc);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": {
        "username": "w1g59@powerscrews.com",
        "password": "81wjywe7"
    }
}
```

To see all results, check out the API page: [https://api.mail.tm/](https://api.mail.tm/).


User needs to login to access JWT token. Registration does not return this information, log in after registration.


After the login process, the user's JWT token and ID are assigned to `mailjs.token` and `mailjs.id`.

---

### Constructor

The general quota limit is 8 queries per second (QPS) per IP address. But this may change over time. If a timeout error occurs, the library waits 1 second and repeats the request. If after 3 attempts the problem is not solved, it throws an error. 

To turn this off or increase the number of attempts, specify this with `rateLimitRetries` when creating the constructor object. Default value is **3**.

Disable it:
```js
const mailjs = new Mailjs({ rateLimitRetries: 0 });
```

Or if a timeout error occurs, try 5 times waiting 1 second each:
```js
const mailjs = new Mailjs({ rateLimitRetries: 5 });
```

### Domain

### List Domains
```js
mailjs.getDomains()
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": [
        {
            "id": "689b70abf60035d6636905a7",
            "domain": "powerscrews.com",
            "isActive": true,
            "isPrivate": false,
            "createdAt": "2025-08-12T00:00:00+00:00",
            "updatedAt": "2025-08-12T00:00:00+00:00"
        },
        ...
    ]
}
```

### Get Domain
```js
mailjs.getDomain("[domain id]")
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": {
        "id": "689b70abf60035d6636905a7",
        "domain": "powerscrews.com",
        "isActive": true,
        "isPrivate": false,
        "createdAt": "2025-08-12T00:00:00+00:00",
        "updatedAt": "2025-08-12T00:00:00+00:00"
    }
}
```


## Account

### Create Account
```js
mailjs.register("user@example.com", "password")
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": {
        "id": "689d1d203b3f5ab1450ae3cb",
        "address": "userddde55ada12asda@powerscrews.com",
        "quota": 40000000,
        "used": 0,
        "isDisabled": false,
        "isDeleted": false,
        "createdAt": "2025-08-13T23:17:52+00:00",
        "updatedAt": "2025-08-13T23:17:52+00:00"
    }
}
```


Error Response (console):
```json
{
    "status": false,
    "data": "{\"status\":422,\"violations\":[{\"propertyPath\":\"address\",\"message\":\"The username \\\"user\\\" is not valid.\",\"code\":null}],\"detail\":\"address: The username \\\"user\\\" is not valid.\",\"type\":\"\\/validation_errors\\/00000000000002df0000000000000000\",\"title\":\"An error occurred\"}"
}
```

### Login

`mailjs.token` and `mailjs.id` can be used to access the user token and id later.

```js
mailjs.login("user@example.com", "password")
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NTUxMjcxNDEsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJhZGRyZXNzIjoidXNlcmRkZGU1NWFkYTEyYXNkYUBwb3dlcnNjcmV3cy5jb20iLCJpZCI6IjY4OWQxZDIwM2IzZjVhYjE0NTBhZTNjYiIsIm1lcmN1cmUiOnsic3Vic2NyaWJlIjpbIi9hY2NvdW50cy82ODlkMWQyMDNiM2Y1YWIxNDUwYWUzY2IiXX19.8OV9d5yDs-G0LIpG_1noJAqRwqYQ7Yps_gJsIV3axqhgL6rqyiA5gieiBsOzxuiMrxREI3jtgCZraWCkDh0nFA",
        "@id": "/accounts/689d1d203b3f5ab1450ae3cb",
        "id": "689d1d203b3f5ab1450ae3cb"
    }
}
```

### Login With Token

If you use the JWT token stored in `mailjs.token` after login, it will allow you to login without username and password.

```js
mailjs.loginWithToken("eyJ0eXAiO...")
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": {
        "id": "689d1d203b3f5ab1450ae3cb",
        "address": "userddde55ada12asda@powerscrews.com",
        "quota": 40000000,
        "used": 0,
        "isDisabled": false,
        "isDeleted": false,
        "createdAt": "2025-08-13T23:17:52+00:00",
        "updatedAt": "2025-08-13T23:17:52+00:00"
    }
}
```

### Get Account Data
```js
mailjs.me()
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": {
        "id": "689d1d203b3f5ab1450ae3cb",
        "address": "userddde55ada12asda@powerscrews.com",
        "quota": 40000000,
        "used": 0,
        "isDisabled": false,
        "isDeleted": false,
        "createdAt": "2025-08-13T23:17:52+00:00",
        "updatedAt": "2025-08-13T23:17:52+00:00"
    }
}
```

### Delete Account
```js
mailjs.deleteMe()
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": ""
}
```

You can also use the id to access the user's information and delete their account.

```js
mailjs.deleteAccount("[account id]")
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": ""
}
```

```js
mailjs.getAccount("[account id]")
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": {
        "id": "689d1d203b3f5ab1450ae3cb",
        "address": "userddde55ada12asda@powerscrews.com",
        "quota": 40000000,
        "used": 0,
        "isDisabled": false,
        "isDeleted": false,
        "createdAt": "2025-08-13T23:17:52+00:00",
        "updatedAt": "2025-08-13T23:17:52+00:00"
    }
}
```

## Message

### List messages
Gets all the Message resources of a given page.

```js
mailjs.getMessages()
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": [
        {
            "id": "689d178bfd759e104159a673",
            "msgid": "<CAGqUVaDYm_RQjefp6gpgMMMsWOERB0BXHwtd3evTM9cxRXMJdw@mail.gmail.com>",
            "from": {
                "address": "codermaster@gmail.com",
                "name": "codermaster"
            },
            "to": [
                {
                    "address": "quhg3@powerscrews.com",
                    "name": ""
                }
            ],
            "subject": "Test",
            "intro": "Text message here",
            "seen": false,
            "isDeleted": false,
            "hasAttachments": false,
            "size": 22422,
            "downloadUrl": "/messages/689d178bfd759e104159a673/download",
            "sourceUrl": "/sources/689d178bfd759e104159a673",
            "createdAt": "2025-08-13T22:53:41+00:00",
            "updatedAt": "2025-08-13T22:54:03+00:00",
            "accountId": "/accounts/689d168aba4ef4b51100c84a"
        },
        {
            "id": "689d16f497861b89e900f3ad",
            "msgid": "<20250813225130.CC8E8300010D@mail.sendtestemail.com>",
            "from": {
                "address": "noreply@sendtestemail.com",
                "name": "SendTestEmail"
            },
            "to": [
                {
                    "address": "quhg3@powerscrews.com",
                    "name": ""
                }
            ],
            "subject": "SendTestEmail.com - Testing Email ID: 6b1d54078794e1d34a8ff71f146be4e5",
            "intro": "If you are reading this your email address is working. This is not spam or a solicitation. This email was sent to your email…",
            "seen": false,
            "isDeleted": false,
            "hasAttachments": false,
            "size": 2265,
            "downloadUrl": "/messages/689d16f497861b89e900f3ad/download",
            "sourceUrl": "/sources/689d16f497861b89e900f3ad",
            "createdAt": "2025-08-13T22:51:30+00:00",
            "updatedAt": "2025-08-13T22:51:32+00:00",
            "accountId": "/accounts/689d168aba4ef4b51100c84a"
        },
        ...
    ]
}
```


### Read a message
Retrieves a Message resource with a specific id (It has way more information than a message retrieved with GET /messages but it hasn't the "intro" member)

```js
mailjs.getMessage("[message id]")
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": {
        "id": "689d178bfd759e104159a673",
        "msgid": "<CAGqUVaDYm_RQjefp6gpgMMMsWOERB0BXHwtd3evTM9cxRXMJdw@mail.gmail.com>",
        "from": {
            "address": "codermaster@gmail.com",
            "name": "codermaster"
        },
        "to": [
            {
                "address": "quhg3@powerscrews.com",
                "name": ""
            }
        ],
        "cc": [],
        "bcc": [],
        "subject": "Test FYI",
        "intro": "Message text",
        "seen": false,
        "flagged": false,
        "isDeleted": false,
        "verifications": {
            "tls": {
                "name": "TLS_AES_256_GCM_SHA384",
                "standardName": "TLS_AES_256_GCM_SHA384",
                "version": "TLSv1.3"
            },
            "spf": false,
            "dkim": false
        },
        "retention": true,
        "retentionDate": "2025-08-20T22:54:03+00:00",
        "text": "Message text",
        "html": [
            "<div>Message text</div>",
        ],
        "hasAttachments": false,
        "size": 22422,
        "downloadUrl": "/messages/689d178bfd759e104159a673/download",
        "sourceUrl": "/sources/689d178bfd759e104159a673",
        "createdAt": "2025-08-13T22:53:41+00:00",
        "updatedAt": "2025-08-13T22:54:03+00:00",
        "accountId": "/accounts/689d168aba4ef4b51100c84a"
    }
}
```


### Delete a message
```js
mailjs.deleteMessage("[message id]")
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": ""
}
```

### Make a message readed or unreaded.
`true` for make readed. `false` for make unreaded.

```js
mailjs.setMessageSeen("[message id]", true)
  .then(console.log);
```

Response (console):
```json
{
    "status": true,
    "message": "ok",
    "data": {
        "seen": true
    }
}
```

## Events
Events are the **S**erver **S**ent **E**vents which are fired when message `arrive`, `seen` or `delete`. It also fires the `error`, `open` state.

### on
Open an event listener to messages and error.

```js
// Add it before other activities if you need it.
mailjs.on("open", msg => console.log("Event listening has begun."));

// When a new message arrives.
mailjs.on("arrive", msg => console.log(`Message id: ${msg.id} has arrived (${msg.intro}).`)); // return as getMessages [data][0]

// When a message is marked as read.
mailjs.on("seen", msg => console.log(`Message id: ${msg.id} marked as seen.`));

// When a message is deleted.
mailjs.on("delete", msg => console.log(`Message id: ${msg.id} has been deleted.`));

// If an error occurs during listening.
mailjs.on("error", err => console.error("Something went wrong:", err));
```

### off
Clears the events and safely closes event listener.

```js
mailjs.off();
```

## Source

### Get source
Gets a Message's Source resource (If you don't know what this is, you either don't really want to use it or you should [read this!](https://en.wikipedia.org/wiki/Email#Plain_text_and_HTML))

```js
mailjs.getSource("[message id]")
  .then(console.log)
```

## Helper Methods

### Create random account.

Creates and logs in an account with a random username and password.

```js
mailjs.createOneAccount()
  .then(console.log);
```

#### Response

```json
{
  "status": true,
  "message": "ok",
  "data": {
    "username": "user@example.com",
    "password": "my-password"
  }
}
```

## Questions And Suggestions
If you have any questions or suggestions, please contact us via email [support@mail.tm](mailto:support@mail.tm) or [discord](https://discord.gg/Mhw2PDZBdk).

---
## ⭐ Show Your Support

If you find this extension useful, please consider giving it a star on GitHub! Your support helps motivate further development and improvements.

[![GitHub stars](https://img.shields.io/github/stars/mamedul/temp-mail?style=for-the-badge)](https://github.com/mamedul/temp-mail/stargazers) &nbsp; If you found this project helpful, give it a ⭐ on GitHub!