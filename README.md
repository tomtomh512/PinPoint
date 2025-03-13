<h1> PinPoint </h1>

A map application for exploring and saving locations

<img src="/assets/demo.png">

<h2>Features</h2>
<ul>
    <li> Interactive Map – Look up points of interest with an intuitive map </li>
    <li> Search & Detailed Info – Find locations and access detailed information </li>
    <li> Personalized Lists – Create an account to save locations to Favorites and Planned lists </li>
</ul>

<h2>Technologies & Implementation</h2>
<ul>
    <li> Frontend – Built with React  </li>
    <li> Backend API – Powered by Flask </li>
    <li> Location Data – Retrieved using the HERE API </li>
    <li> Map Rendering – Implemented with Leaflet </li>
    <li> Authentication – Managed through session cookies </li>
    <li> Database Management – Handled with SQLAlchemy </li>
</ul>

<h2> How to run </h2>

Backend Setup (Server Directory)

<pre><code>cd server
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
flask run
</code></pre>

Frontend Setup (Client Directory)

<pre><code>cd client
npm install
npm start
</code></pre>
