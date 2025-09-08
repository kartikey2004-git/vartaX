MERN Stack Chat-app which is a microservices based

3 services :  
   - Chat service 
   - User service
   - Mail service using rabbitMQ ( which is a message broker )

Technologies used : MERN , socket.io , redis and aws deployment 

- project deployed on AWS

Features of this app
   
    
  1. - authentication
     - send verification code for email 
     - OTP send through rabbitMQ
   (ek controller mein otp banke use redis mein store kr rhe hai)

     - mail service through rabbitMQ


  2. two section , profile, logout and there is a section of list of chats and we can create new conversation
     
     - we can send messages along with sent time along with date

     - unread messages number at each chat if not seen that message

     - status of other user , online or offline

     - seen blue tick if msg is seen
     - typing animation if users start typing

     - sent real time messages and seen msg also update real time


     - sent real time images and image preview and if we have nothing on message box , button state should be disabled

     - and if we start a conversation then it's a latest conversation and it should be on top
     
     - we can change our username on profile page

     - if user logged out then status will be offline


-------------------------------------------

To create a tsconfig.json file , there is command named 

```bash
npx tsc -init
```


- "target": "es2020" in tsconfig.json : 
    
   - tells the TypeScript compiler which version of JavaScript it should generate when compiling your TypeScript code.

- "module": "nodenext" in tsconfig.json :
   
   - tells TypeScript what kind of module system to use when compiling.


     - JavaScript has a few different module systems: 


         - CommonJS (CJS) → uses require() and module.exports (default in Node.js for years).


         - ES Modules (ESM) → uses import and export (newer standard).


"module": "nodenext" : 
   
   - special setting introduced in TypeScript 4.7+.


   - designed for Node.js projects that use both CommonJS and ESM depending on the file extension or package.json settings.


        - If a file has .cjs → TypeScript treats it as CommonJS.


        - If a file has .mjs or if your package.json has "type": "module" → it treats it as ESM.


        - It also aligns with Node.js’s real behavior (so TypeScript matches how Node itself would resolve imports).


-------------------------------------------

- "build": "tsc" : builds the typescript code  


- if we have install dependencies , so we also need to install their types , if we go through typescript



   - concurrently is a small Node.js package that lets you run multiple commands/scripts at the same time in one terminal.


   - Normally, if you try to run two scripts with &&, the second one waits for the first to finish.


   - With concurrently, both run in parallel.

-------------------------------------------

```bash
"dev": "concurrently \"tsc -w\" \"nodemon dist/index.js\""
```


  - 1. concurrently : Runs multiple commands in parallel (instead of one after the other).

  - 2. tsc -w : 
     
     - Runs the TypeScript compiler (tsc).

     - -w means watch mode → it automatically recompiles your .ts files whenever you save changes.


     - Output JavaScript is written into the dist/ folder (based on your tsconfig.json).

  
  - 3. nodemon dist/index.js
       
      - Runs nodemon, a tool that watches for file changes and restarts your app automatically.


      - it runs the compiled JavaScript file (dist/index.js).


      - very time tsc recompiles, nodemon sees the updated JS and restarts your server.
 
-------------------------------------------


throw new ApiError(400, "All fields are required");


return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered sucessfully"));

--------------------------------------------


1. In plain JS (without TS)
   
   - When you define a Mongoose model, Mongoose doesn’t care about types. 

   - It just stores whatever you give it, unless the schema validation blocks it.


```bash
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);
```

   
   - JS doesn’t stop you

```bash
const u = new User({ name: 123, email: false });
```
    
   - At runtime, Mongoose might complain, but the compiler never will.


2. In TypeScript:
   
   - TypeScript needs to know the shape of your data at compile time

   - so it can give you autocomplete, error checking, and type safety.


That’s why we explicitly define an interface like:

```bash
export interface IUser extends Document {
  name: string;
  email: string;
}
```

   - extends Document → tells TS that this is a MongoDB/Mongoose document (so it has _id, timestamps, etc.).


   - name: string; email: string; → tells TS what fields the user should have



3. . Why it’s needed

   - Without this, TS has no idea what your User model’s documents look like.


```bash
const user = await User.findById("123");

console.log(user.name); // TS: ❌ Property 'name' does not exist
```

   - TypeScript would complain, because by default Mongoose returns any (no type safety)


- But if you connect your model to IUser:

```bash
const User = mongoose.model<IUser>("User", userSchema);

const user = await User.findById("123");

console.log(user.name); // ✅ TS knows it's a string
``` 
   - Now you get autocomplete + compile-time safety.


--------------------------------------------

  - We explicitly define IUser (or any model interface) in TypeScript because:
     
     - JavaScript doesn’t provide type information.

     - TypeScript needs to know the structure of documents at compile time.


     - It gives you autocomplete, IntelliSense, and safety when querying Mongoose models.


--------------------------------------------

- In auth , now we are going to send OTP to the user , so we will save it in Redis and for redis , We will use upstash

   - Official websites of redis , it gives us storage of 30MB , but we get storage of 256MB on upstash


   - step-1 create a new database

     - redis --> create database , then we have to select primary region 

     - free tier 256 MB and then create 
     - we're using io.redis here for our mail service


     - we have to send OTP , but we are going to send OTP through mail service mein humein ek msg bhejna hai which through a message broker rabbitMQ

--------------------------------------------

## RabbitMQ 

"
Bonus Tip:
  
- In a real-world scalable app, 
never send emails or long-running tasks 
directly in the controller


Always offload them to a queue using tools
like RabbitMQ, BullMQ or Kafka."


- monolithic and microservices architecture

   - In monolithic architecture 
     
      - In OTP verification there is a traditional process that 

         - first we asked for email 
         - check user with email exists in database or not
         - and then we create a OTP 
         - and then send OTP through nodemailer 
         - and then verify OTP and saved it to database

   
   - In microservices architecture
        
        - check for user with email exist in the database or not 
        
        - but we have to send the OTP mail through mail service , we can do this work using RabbitMQ, Bull MQ , or kafka


   1. User hits Login API 

      - User → banda jo app use kar raha hai

      - Hits → iska matlab hai user ne request bheji 

      - Login API → ek specific endpoint jo login request handle karta hai (for example: POST /api/login).


   - Kya hota hai is time?
      
      1. Backend ek 6 digit OTP banata hai. Example: 123456

      2. OTP ko Redis mein store karte hai

         - Redis = ek fast in-memory database.

         - Redis mein hum OTP ko key-value ke form mein save kar dete hain. Example:

```bash
key: "otp:user@example.com"
value: "123456"
expiry: 300 seconds (5 minutes)
```  
-    -  

         - Matlab OTP 5 minute ke baad automatic expire ho jayega.


      3. Ab ek message prepare karte hain jo email bhejne ke liye chahiye:
      

```json
{
   "to": "user@example.com",            // jis bande ko mail bhejni hai
   "subject": "Your OTP code",         // mail ka subject line
   "body": "Your OTP is 123456. It is valid for 5 minutes."  // mail ka content
}
``` 
  
   4. Ye message RabbitMQ ke queue mein bheja jata hai. (by producer)
      
      - Function call: publishToQueue("send-otp", message)

      - Yaha "send-otp" ek queue ka naam hai. Matlab is queue mein hum OTP mails daal rahe hain.

   
   5. Producer (Login Service)
     
     - Producer ka matlab hai → jo banda message queue mein bhejta hai.

     - Yaha Login API / Login Service producer hai.


   Producer ka kaam:
      
      - Message banakar queue mein daalna.
      - Example:
      
         - Producer bolega: “Bhai maine OTP mail bhejne ka kaam add kar diya queue mein.”

         - Ab wo wait nahi karega ki mail kab bheja jaa raha hai.


3. Consumer (Mail Worker)

   - Consumer ka matlab hai → jo banda queue se message nikalta hai aur kaam karta hai.

   - Yaha Mail Service / Worker consumer hai.

     - Consumer ka flow:

       - Worker ek alag process/file hota hai (consumer.ts maan lo).

         - Ye continuously RabbitMQ ke "send-otp" queue ko listen karta hai.

         - Matlab har second check karta hai: “kya naya message aaya hai?”

         - Jaise hi ek naya message aata hai:

         - Wo message padhta hai:

{
   "to": "user@example.com",
   "subject": "Your OTP code",
   "body": "Your OTP is 123456. It is valid for 5 minutes."
}


   - Nodemailer ya SendGrid jaisi library/service se mail bhejta hai.

   - Agar mail successful gaya → RabbitMQ ko bolta hai:
     
     - channel.ack(msg) → Matlab “ye kaam ho gaya, is message ko queue se hata do.”
     
     - Agar mail fail ho jaye?
     
     - RabbitMQ dobara queue mein message daal deta hai.
     
     - Matlab retry hota hai jab tak mail bhej na diya jaye.




4. Why RabbitMQ?

Non-blocking

   - API turant user ko response de deti hai: “OTP sent successfully.”

   - Mail bhejne ka kaam background worker karega.

   - User ko wait nahi karna padta.


Scalable

   - Agar ek hi waqt pe 10,000 users login karte hain, toh problem nahi.

   - Hum 10 consumer workers parallel run kar sakte hain.

   - Sab OTP mails distribute ho jaayenge.


Reliable

   - Agar ek mail fail ho gaya, toh RabbitMQ message ko dubara bhejne ki koshish karega.

   - Matlab ek bhi OTP mail miss nahi hoga.


5. Analogy (Daily Life Example)

- Socho tumhe ek letter bhejna hai:

    - Producer (Tum): Tum letter likhte ho aur postbox mein daal dete ho.


    - RabbitMQ (Post Office): Post office letter hold karke rakhta hai aur ensure karta hai ki delivery hogi.


    - Consumer (Postman): Postman aata hai, letter uthata hai, aur deliver karta hai.


    - Agar postman fail ho gaya (bimaar ho gaya), toh doosra postman wo letter deliver karega.


--------------------------------------------



- Login service OTP banata hai aur Redis mein store karta hai.

- Mail bhejna uska kaam nahi hai.

- Mail bhejne ka kaam ek alag service (consumer) karegi.

- RabbitMQ dono ke beech post office ki tarah kaam karta hai.



   
- Firstly we need to setup rabbitMQ and will run it on Docker

--------------------------------------------


- by opening docker desktop , docker engine will started and then we have to open cmd
   
   cmd : To run rabbitMQ on docker

```bash
docker run -d --hostname rabbitmq-host --name rabbitmq-container -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASSWORD=admin123 -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```


