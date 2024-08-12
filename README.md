<p><strong>Fullstack Assignment</strong></p>

<p><strong>Overview</strong></p>

<p>I successfully completed the a Twitch clone app, with built in Real time Chat system, utilizing websockets for chat functionality. This allows the admin, user, and superadmin to have the ability based upon their status for chat room.
For this application I utilized Next.js/React, Supabase , Google Firebase, Node.js, Express , Google authentication. Theres a push notification where followers are sent an email when the streamer is online.

<p><strong>Dependencies Used</strong></p>

<ul>
  <li><strong>@supabase/supabase-js</strong>: Online PostgreSQL Database.</li>
  <li><strong>axios</strong>: Simplifies requests to other servers or APIs.</li>
  <li><strong>bcryptjs</strong>: Encrypts passwords securely before storage.</li>
  <li><strong>body-parser</strong>: Helps the server handle form or API data.</li>
  <li><strong>cors</strong>: Safely allows interaction with other websites or servers.</li>
  <li><strong>dotenv</strong>: Manages environment variables securely.</li>
  <li><strong>express</strong>: Backend framework for Node.js.</li>
  <li><strong>express-session</strong>: Manages sessions in the backend.</li>
  <li><strong>firebase</strong>: Integrates Google's backend services (databases, auth).</li>
  <li><strong>googleapis</strong>: Provides programmable access to Google services.</li>
  <li><strong>hi-base32</strong>: Converts data for authentication apps like Google Authenticator.</li>
  <li><strong>jsonwebtoken</strong>: Manages security tokens.</li>
  <li><strong>morgan</strong>: Logs activities in the backend.</li>
  <li><strong>next</strong>: React framework.</li>
  <li><strong>nodemailer</strong>: Sends emails from the application.</li>
  <li><strong>otpauth</strong>: Generates codes for two-factor authentication.</li>
  <li><strong>qrcode</strong>: Generates QR codes.</li>
  <li><strong>react</strong>: Frontend framework.</li>
  <li><strong>tailwindcss</strong>: Allows inline styling of HTML elements.</li>
  <li><strong>typescript</strong>: Adds types for more controlled JavaScript projects.</li>
</ul>

<p><strong>Challenges Faced</strong></p>

<p>The main challenge was visualizing the user flow and optimizing the user experience. Creating a schema and flowchart (available in the public folder of the GitHub repository) helped map out the user journey and clarify feature requirements. This structured approach provided a clear development direction, easing the implementation of features.</p>
<img src ="./public/Frontend.PNG"/>
<img src = "./public/Database%20schema.PNG"/>
<p><strong>How to Run the Project</strong></p>

<p><strong>A. Running Locally</strong></p>

<ol>
  <li> Note - I know that .env isn't suppose to be uploaded, I thought I would upload it because if anyone wants to install locally since i cannot get website up. </li>
  <li>Clone the repository from GitHub: <code>git clone &lt;repository-url&gt;</code></li>
  <li>Navigate to the project directory: <code>cd &lt;project-folder&gt;</code></li>
  <li>Install dependencies: <code>npm install</code></li>
  <li>Start the backend server in one terminal: <code>npm run dev:backend</code></li>
  <li>Start the frontend development server in another terminal: <code>npm run dev:frontend</code></li>
  <li>Open your browser and go to <a href="http://localhost:3000">http://localhost:3000</a> to view the application.</li>
</ol>

<p><strong>B. There gifs that show overall project </strong></p>

<p><strong>2FAModal.png</strong></p>
<img src="./public/images/2FAModal.png" alt="2FAModal" />

<p><strong>ChangeInfo.png</strong></p>
<img src="./public/images/Profile.png" alt="ChangeInfo" />

<p><strong>ChangePw.png</strong></p>
<img src="./public/ChangePw.png" alt="ChangePw" />

<p><strong>ChannelPage.png</strong></p>
<img src="./public/images/ChannelPage.png" alt="ChannelPage" />

<p><strong>ChannelTab.png</strong></p>
<img src="./public/images/ChannelTab.png" alt="ChannelTab" />

<p><strong>ChatTrie.gif</strong></p>
<img src="./public/images/ChatTrie.gif" alt="ChatTrie" />

<p><strong>CreateAccount.png</strong></p>
<img src="./public/images/CreateAccount.png" alt="CreateAccount" />

<p><strong>CreateUser.gif</strong></p>
<img src="./public/images/CreateUser.gif" alt="CreateUser" />

<p><strong>Landing Page 1</strong></p>
<img src="./public/LandingPage1.png" alt="Homepage1" />

<p><strong>Homepage.png</strong></p>
<img src="./public/LandingPage2.png" alt="Homepage2" />

<p><strong>Homepage.png</strong></p>
<img src="./public/LandingPage3.png" alt="Homepage3" />

<p><strong>Login2FA.gif</strong></p>
<img src="./public/images/Login2FA.gif" alt="Login2FA" />

<p><strong>LoginModal.gif</strong></p>
<img src="./public/images/LoginModal.gif" alt="LoginModal" />

<p><strong>LoginModal.png</strong></p>
<img src="./public/images/LoginModal.png" alt="LoginModal" />

<p><strong>NavbarProfile.gif</strong></p>
<img src="./public/images/NavbarProfile.gif" alt="NavbarProfile" />

<p><strong>ProfileChannel.gif</strong></p>
<img src="./public/images/ProfileChannel.gif" alt="ProfileChannel" />
