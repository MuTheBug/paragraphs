/* ═══════════════════════════════════════════════════════════════
   JusticeCMS — Course Content  (js/content.js)
   All modules and lessons for the interactive course.
═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── Helper: build a code block string ─────────────────────────
function cb(lang, file, code) {
  return `<div class="code-block"><div class="code-header"><span class="code-lang">${lang}</span>${file?`<span class="code-file">${file}</span>`:''}<button class="btn-copy">Copy</button></div><pre>${code}</pre></div>`;
}
function callout(type, label, body) {
  const icons={info:'ℹ️',warn:'⚠️',tip:'💡',key:'🔑'};
  return `<div class="callout ${type}"><span class="callout-icon">${icons[type]}</span><div class="callout-body"><strong>${label}</strong>${body}</div></div>`;
}
function quiz(question, options, correct, explanation) {
  const letters=['A','B','C','D','E'];
  const opts = options.map((o,i)=>`<div class="quiz-option" data-correct="${i===correct?1:0}"><div class="opt-letter">${letters[i]}</div><span>${o}</span></div>`).join('');
  return `<div class="quiz-block"><div class="quiz-label">Quiz</div><div class="quiz-question">${question}</div><div class="quiz-options">${opts}</div><div class="quiz-explanation">${explanation}</div></div>`;
}
function exercise(title, body) {
  return `<div class="exercise"><div class="exercise-badge">🏋️ Exercise</div><h3>${title}</h3>${body}</div>`;
}
function term(title, hints, intro) {
  const id='t'+Math.random().toString(36).slice(2);
  return `<div class="terminal" data-term-id="${id}">
    <div class="terminal-titlebar"><div class="terminal-dot red"></div><div class="terminal-dot yellow"></div><div class="terminal-dot green"></div><span class="terminal-label">${title||'Terminal'}</span></div>
    <div class="terminal-output">${intro?`<div><span class="t-info">${intro}</span></div>`:''}</div>
    <div class="terminal-input-row"><span class="t-prompt">user@server:~$&nbsp;</span><input class="terminal-input" type="text" spellcheck="false" autocomplete="off" placeholder="type a command…"></div>
    <div class="terminal-hint">Try: ${(hints||['ls','pwd','whoami']).join(', ')}</div>
  </div>`;
}


// ═══════════════════════════════════════════════════════════════
//  COURSE DATA
// ═══════════════════════════════════════════════════════════════
const COURSE_DATA = {
  title: 'JusticeCMS — Python Web Stack Course',
  modules: [

// ─────────────────────────────────────────────────────────────
// MODULE 00 — Linux & Environment
// ─────────────────────────────────────────────────────────────
{
  id:'m00', num:'00', title:'Linux & Environment Setup',
  lessons:[
    {
      id:'l01', title:'Why Linux for Backend Development',
      duration:'15 min',
      intro:'Before writing a single line of Python, we need to understand why Linux is the standard platform for server-side applications — and get comfortable with the command line.',
      builds:'Understanding the deployment environment for JusticeCMS',
      content:`
        <h2>Linux is Where Code Lives</h2>
        <p>When you deploy a web application, it almost certainly runs on a Linux server. Not macOS, not Windows — Linux. Understanding why, and learning to feel at home in a Linux environment, is the single most valuable skill a backend developer can have.</p>
        ${callout('key','Why Linux?','Linux is free, open-source, extremely stable, and has dominated server infrastructure for decades. Nearly every cloud provider (AWS, GCP, Azure) defaults to Linux VMs. Docker containers are Linux. Your FastAPI app will live on Linux.')}
        <h2>The Shell is Your Cockpit</h2>
        <p>The <strong>shell</strong> (usually <code>bash</code> or <code>zsh</code>) is the text interface where you control a Linux system. It feels intimidating at first, but it is far faster and more powerful than any GUI for server management tasks.</p>
        ${cb('bash','','<span class="cm"># Print the current directory</span>\n<span class="fn">pwd</span>\n<span class="cm"># Output: /home/user</span>\n\n<span class="cm"># List files in the current directory</span>\n<span class="fn">ls</span> -la\n\n<span class="cm"># Show who you are logged in as</span>\n<span class="fn">whoami</span>')}
        ${callout('tip','Tip: Tab Completion','Press Tab after typing the first few letters of a command or filename. The shell will autocomplete it. Press Tab twice to see all matching options.')}
        <h2>Everything is a File</h2>
        <p>One of Linux's core design principles is that <em>everything is a file</em>. Your hard drive, network sockets, running processes — they all appear as files in the filesystem. This makes scripting and automation remarkably powerful.</p>
        <h2>Try It Now</h2>
        ${term('Linux Terminal',['pwd','whoami','ls','uname -a','date'],'Welcome! This is a simulated Linux terminal. Try the commands below.')}
        ${quiz(
          'What command shows the current working directory in Linux?',
          ['cd','ls','pwd','mkdir'],
          2,
          '<strong>pwd</strong> stands for "print working directory". It shows the full path of where you currently are in the filesystem.'
        )}
        ${exercise('Explore Your Environment',`<p>Using the terminal above, run each of these commands and note what they output:</p><ul><li><code>pwd</code> — where are you?</li><li><code>whoami</code> — who are you?</li><li><code>uname -a</code> — what kernel is running?</li><li><code>ls -la</code> — what files are here?</li></ul>`)}
      `
    },
    {
      id:'l02', title:'Essential Linux Commands',
      duration:'25 min',
      intro:'A practical crash course in the 20 commands you will use every single day as a backend developer.',
      builds:'Shell confidence for the entire course',
      content:`
        <h2>Navigation &amp; Files</h2>
        ${cb('bash','','<span class="cm"># Move between directories</span>\n<span class="fn">cd</span> /var/log           <span class="cm"># absolute path</span>\n<span class="fn">cd</span> ..               <span class="cm"># go up one level</span>\n<span class="fn">cd</span> ~                <span class="cm"># go to home directory</span>\n\n<span class="cm"># Create / remove</span>\n<span class="fn">mkdir</span> -p app/src     <span class="cm"># create nested dirs</span>\n<span class="fn">touch</span> main.py        <span class="cm"># create empty file</span>\n<span class="fn">rm</span> file.txt          <span class="cm"># delete file</span>\n<span class="fn">rm</span> -rf old_dir/      <span class="cm"># delete directory (careful!)</span>\n\n<span class="cm"># Copy and move</span>\n<span class="fn">cp</span> src.py dst.py     <span class="cm"># copy</span>\n<span class="fn">mv</span> old.py new.py     <span class="cm"># rename / move</span>')}
        ${callout('warn','Warning: rm -rf','There is no trash bin on Linux. <code>rm -rf</code> permanently deletes files instantly. Always double-check the path before running it.')}
        <h2>Viewing File Contents</h2>
        ${cb('bash','','<span class="fn">cat</span> file.txt          <span class="cm"># print entire file</span>\n<span class="fn">head</span> -20 file.txt     <span class="cm"># first 20 lines</span>\n<span class="fn">tail</span> -50 file.log     <span class="cm"># last 50 lines</span>\n<span class="fn">tail</span> -f app.log       <span class="cm"># live-follow a log file</span>\n<span class="fn">less</span> bigfile.txt      <span class="cm"># scroll through (q to quit)</span>\n<span class="fn">grep</span> <span class="st">"ERROR"</span> app.log  <span class="cm"># search for pattern</span>')}
        <h2>Permissions</h2>
        <p>Every file on Linux has an owner and a permission set. The <code>chmod</code> command changes what users can do with a file.</p>
        ${cb('bash','','<span class="fn">ls</span> -la\n<span class="cm"># -rw-r--r-- 1 user user 512 Jan 01 main.py</span>\n<span class="cm">#  ^^^------  owner group</span>\n<span class="cm">#  rwx = read, write, execute</span>\n\n<span class="fn">chmod</span> +x start.sh    <span class="cm"># make file executable</span>\n<span class="fn">chmod</span> 755 script.sh  <span class="cm"># owner:rwx group:r-x other:r-x</span>\n<span class="fn">chown</span> user:user file.py  <span class="cm"># change owner</span>')}
        <h2>Process Management</h2>
        ${cb('bash','','<span class="fn">ps</span> aux               <span class="cm"># list running processes</span>\n<span class="fn">top</span>                  <span class="cm"># live process monitor (q to quit)</span>\n<span class="fn">kill</span> 12345           <span class="cm"># stop process by PID</span>\n<span class="fn">kill</span> -9 12345        <span class="cm"># force-stop process</span>\n<span class="fn">pkill</span> uvicorn        <span class="cm"># stop by name</span>')}
        ${quiz(
          'Which command lets you see a live-updating view of running processes?',
          ['ps aux','top','ls -la','grep pid'],
          1,
          '<strong>top</strong> shows a live, updating view of running processes sorted by CPU usage. Press <code>q</code> to quit.'
        )}
        ${term('Commands Practice',['ls -la','mkdir testdir','pwd','whoami'],'Practice the commands from this lesson.')}
      `
    },
    {
      id:'l03', title:'Python & Virtual Environments',
      duration:'20 min',
      intro:'Install Python, understand virtual environments, and set up the project structure for JusticeCMS.',
      builds:'Project skeleton: justice_cms/ with activated virtualenv',
      content:`
        <h2>Python Version Management</h2>
        <p>For JusticeCMS we use <strong>Python 3.12</strong>. Always be explicit about the Python version — many Linux servers have both Python 2 and Python 3 installed.</p>
        ${cb('bash','','<span class="cm"># Check installed versions</span>\n<span class="fn">python3</span> --version\n<span class="fn">python3.12</span> --version\n\n<span class="cm"># Install Python 3.12 on Ubuntu/Debian</span>\n<span class="fn">sudo</span> apt update\n<span class="fn">sudo</span> apt install -y python3.12 python3.12-venv python3-pip')}
        <h2>What is a Virtual Environment?</h2>
        <p>A <strong>virtual environment</strong> (venv) is an isolated Python installation for a single project. Without it, all your Python packages would be installed globally, and different projects would conflict with each other.</p>
        ${callout('key','Golden Rule','Every Python project gets its own virtual environment. Activate it before installing packages or running code.')}
        ${cb('bash','','<span class="cm"># Create the project directory</span>\n<span class="fn">mkdir</span> justice_cms && <span class="fn">cd</span> justice_cms\n\n<span class="cm"># Create a virtual environment named .venv</span>\n<span class="fn">python3.12</span> -m venv .venv\n\n<span class="cm"># Activate it (Linux/macOS)</span>\n<span class="fn">source</span> .venv/bin/activate\n<span class="cm"># Prompt changes to: (.venv) user@server:~/justice_cms$</span>\n\n<span class="cm"># Deactivate when done</span>\n<span class="fn">deactivate</span>')}
        <h2>pip — the Package Installer</h2>
        ${cb('bash','','<span class="cm"># Install a package</span>\n<span class="fn">pip</span> install fastapi\n\n<span class="cm"># Install specific version</span>\n<span class="fn">pip</span> install <span class="st">"fastapi==0.115.0"</span>\n\n<span class="cm"># Save all installed packages to a file</span>\n<span class="fn">pip</span> freeze > requirements.txt\n\n<span class="cm"># Install from requirements file (e.g. after git clone)</span>\n<span class="fn">pip</span> install -r requirements.txt')}
        <h2>Project Structure</h2>
        ${cb('bash','','justice_cms/\n├── .venv/              <span class="cm"># virtual environment (NOT committed to git)</span>\n├── app/\n│   ├── __init__.py\n│   ├── main.py         <span class="cm"># FastAPI app entry point</span>\n│   ├── models/         <span class="cm"># SQLAlchemy models</span>\n│   ├── routers/        <span class="cm"># API route handlers</span>\n│   ├── schemas/        <span class="cm"># Pydantic schemas</span>\n│   └── core/           <span class="cm"># config, security, database</span>\n├── alembic/            <span class="cm"># database migrations</span>\n├── tests/\n├── requirements.txt\n├── .env                <span class="cm"># secrets (NOT committed to git)</span>\n└── docker-compose.yml')}
        ${callout('warn','Never commit .venv or .env','Add both to your <code>.gitignore</code> file. Your virtual environment is huge (100s of MB) and your <code>.env</code> contains passwords.')}
        ${quiz(
          'Why do we use virtual environments in Python projects?',
          ['To make Python run faster','To isolate project dependencies from each other','To encrypt our source code','To enable multi-threading'],
          1,
          'Virtual environments isolate each project\'s packages. Without them, installing package X for project A could break project B if they need different versions of X.'
        )}
        ${exercise('Create the Project',`<ul><li>Create the <code>justice_cms/</code> directory structure shown above</li><li>Create and activate a virtual environment</li><li>Create an empty <code>app/__init__.py</code> and <code>app/main.py</code></li><li>Run <code>pip install fastapi uvicorn</code> and then <code>pip freeze > requirements.txt</code></li></ul>`)}
      `
    }
  ]
},


// ─────────────────────────────────────────────────────────────
// MODULE 01 — Python for Web Development
// ─────────────────────────────────────────────────────────────
{
  id:'m01', num:'01', title:'Python for Web Development',
  lessons:[
    {
      id:'l01', title:'Type Hints & Pydantic',
      duration:'25 min',
      intro:'Modern Python uses type hints everywhere. FastAPI is built entirely on them. Master this and the rest of the course will feel natural.',
      builds:'Core Pydantic schemas for JusticeCMS data models',
      content:`
        <h2>Type Hints — Python Gets Serious</h2>
        <p>Python is dynamically typed, meaning you don't have to declare variable types. But since Python 3.5, you <em>can</em> add type hints, and since Python 3.12 they are everywhere in modern codebases.</p>
        ${cb('python','','<span class="cm"># Without type hints (still valid Python)</span>\n<span class="kw">def</span> <span class="fn">get_user</span>(user_id):\n    <span class="kw">return</span> {<span class="st">"id"</span>: user_id}\n\n<span class="cm"># With type hints (modern Python)</span>\n<span class="kw">def</span> <span class="fn">get_user</span>(user_id: <span class="fn">int</span>) -> <span class="fn">dict</span>:\n    <span class="kw">return</span> {<span class="st">"id"</span>: user_id}\n\n<span class="cm"># Complex types from the typing module</span>\n<span class="kw">from</span> typing <span class="kw">import</span> Optional, List\n\n<span class="kw">def</span> <span class="fn">search_cases</span>(\n    query: <span class="fn">str</span>,\n    limit: <span class="fn">int</span> = <span class="num">10</span>,\n    status: Optional[<span class="fn">str</span>] = <span class="kw">None</span>\n) -> List[<span class="fn">dict</span>]:\n    ...')}
        <h2>Pydantic — Validation on Steroids</h2>
        <p>Pydantic uses type hints to automatically validate and parse data. It is the backbone of FastAPI. When a request comes in, Pydantic validates the JSON body and converts it into a typed Python object.</p>
        ${cb('python','app/schemas/case.py','<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel, EmailStr, field_validator\n<span class="kw">from</span> typing <span class="kw">import</span> Optional\n<span class="kw">from</span> datetime <span class="kw">import</span> datetime\n<span class="kw">from</span> enum <span class="kw">import</span> Enum\n\n<span class="kw">class</span> <span class="fn">CaseStatus</span>(Enum):\n    FILED    = <span class="st">"filed"</span>\n    ACTIVE   = <span class="st">"active"</span>\n    PENDING  = <span class="st">"pending"</span>\n    CLOSED   = <span class="st">"closed"</span>\n\n<span class="kw">class</span> <span class="fn">CaseCreate</span>(BaseModel):\n    title:       <span class="fn">str</span>\n    description: <span class="fn">str</span>\n    case_type:   <span class="fn">str</span>\n    filed_by:    <span class="fn">int</span>   <span class="cm"># user ID</span>\n\n    <span class="dec">@field_validator</span>(<span class="st">"title"</span>)\n    <span class="dec">@classmethod</span>\n    <span class="kw">def</span> <span class="fn">title_not_empty</span>(cls, v: <span class="fn">str</span>) -> <span class="fn">str</span>:\n        <span class="kw">if not</span> v.strip():\n            <span class="kw">raise</span> ValueError(<span class="st">"Title cannot be empty"</span>)\n        <span class="kw">return</span> v.strip()\n\n<span class="kw">class</span> <span class="fn">CaseResponse</span>(BaseModel):\n    id:         <span class="fn">int</span>\n    title:      <span class="fn">str</span>\n    status:     <span class="fn">CaseStatus</span>\n    created_at: <span class="fn">datetime</span>\n\n    <span class="kw">class</span> <span class="fn">Config</span>:\n        from_attributes = <span class="kw">True</span>  <span class="cm"># allow ORM objects</span>')}
        ${callout('key','CaseCreate vs CaseResponse','A common pattern: one schema for creating (input), one for reading (output). The response schema often adds fields like <code>id</code> and <code>created_at</code> that are set by the server.')}
        ${quiz(
          'What does Pydantic do when it receives data that doesn\'t match the declared type?',
          ['It silently ignores the mismatch','It logs a warning','It raises a ValidationError','It converts the value automatically in all cases'],
          2,
          'Pydantic raises a <code>ValidationError</code> with a detailed description of what failed. FastAPI catches this and returns a 422 response to the client automatically.'
        )}
      `
    },
    {
      id:'l02', title:'Async/Await in Python',
      duration:'20 min',
      intro:'FastAPI is asynchronous. Understanding async/await is not optional — it\'s how FastAPI handles thousands of concurrent requests without blocking.',
      builds:'Async database and HTTP patterns used throughout the course',
      content:`
        <h2>The Problem: Blocking I/O</h2>
        <p>Imagine a restaurant where the waiter takes an order, then stands at the table staring at the kitchen until the food is ready — refusing to serve anyone else. That's <strong>blocking I/O</strong>. A traditional synchronous web server works this way.</p>
        <p>With <strong>async I/O</strong>, the waiter takes the order, drops it at the kitchen window, then goes to serve other tables. When the food is ready, they come back.</p>
        ${cb('python','','<span class="cm"># SYNCHRONOUS — blocks the whole thread</span>\n<span class="kw">import</span> time\n\n<span class="kw">def</span> <span class="fn">get_case_from_db</span>(case_id: <span class="fn">int</span>):\n    time.sleep(<span class="num">0.1</span>)  <span class="cm"># simulate DB query — BLOCKS</span>\n    <span class="kw">return</span> {<span class="st">"id"</span>: case_id}\n\n<span class="cm"># ASYNCHRONOUS — yields control while waiting</span>\n<span class="kw">import</span> asyncio\n\n<span class="kw">async def</span> <span class="fn">get_case_from_db</span>(case_id: <span class="fn">int</span>):\n    <span class="kw">await</span> asyncio.sleep(<span class="num">0.1</span>)  <span class="cm"># yields control — NON-BLOCKING</span>\n    <span class="kw">return</span> {<span class="st">"id"</span>: case_id}')}
        <h2>async def &amp; await</h2>
        <p>Two keywords to remember:</p>
        <ul>
          <li><code>async def</code> — declares a coroutine function. Calling it returns a coroutine object, not a result.</li>
          <li><code>await</code> — suspends the current coroutine until the awaitable completes. Can only be used inside <code>async def</code>.</li>
        </ul>
        ${cb('python','app/routers/cases.py','<span class="kw">from</span> fastapi <span class="kw">import</span> APIRouter\n<span class="kw">from</span> sqlalchemy.ext.asyncio <span class="kw">import</span> AsyncSession\n\nrouter = <span class="fn">APIRouter</span>()\n\n<span class="dec">@router.get</span>(<span class="st">"/cases/{case_id}"</span>)\n<span class="kw">async def</span> <span class="fn">read_case</span>(case_id: <span class="fn">int</span>, db: AsyncSession):\n    <span class="cm"># await suspends this coroutine while DB query runs</span>\n    result = <span class="kw">await</span> db.<span class="fn">execute</span>(\n        <span class="fn">select</span>(Case).<span class="fn">where</span>(Case.id == case_id)\n    )\n    <span class="kw">return</span> result.<span class="fn">scalar_one_or_none</span>()')}
        ${callout('info','When NOT to use async','CPU-bound tasks (heavy computation, image processing) don\'t benefit from async — they block the event loop. Use Celery worker processes for those instead.')}
        ${quiz(
          'What does the "await" keyword do?',
          ['Makes the function run in a separate thread','Pauses execution until an async operation finishes, without blocking other tasks','Forces synchronous execution','Creates a new async event loop'],
          1,
          '<strong>await</strong> suspends the current coroutine and yields control back to the event loop, which can run other coroutines while waiting. This is the whole point of async programming.'
        )}
      `
    }
  ]
},


// ─────────────────────────────────────────────────────────────
// MODULE 02 — PostgreSQL & SQLAlchemy
// ─────────────────────────────────────────────────────────────
{
  id:'m02', num:'02', title:'PostgreSQL & SQLAlchemy',
  lessons:[
    {
      id:'l01', title:'PostgreSQL Fundamentals',
      duration:'30 min',
      intro:'PostgreSQL is the most powerful open-source relational database in the world. Court systems demand ACID compliance, complex queries, and rock-solid data integrity — PostgreSQL delivers all three.',
      builds:'JusticeCMS database running in Docker with initial schema',
      content:`
        <h2>Why PostgreSQL?</h2>
        <p>A <strong>relational database</strong> stores data in tables with rows and columns. Relationships between tables are enforced by foreign keys. This is perfect for court data, which is naturally interconnected: cases have parties, parties have hearings, hearings have documents.</p>
        ${callout('key','ACID Transactions','PostgreSQL guarantees Atomicity, Consistency, Isolation, and Durability. If you update a case status and log it in an audit table, either BOTH succeed or NEITHER does. No partial writes.')}
        <h2>Running PostgreSQL with Docker</h2>
        ${cb('yaml','docker-compose.yml','<span class="kw">version</span>: <span class="st">"3.9"</span>\n\n<span class="kw">services</span>:\n  <span class="fn">postgres</span>:\n    image: postgres:16-alpine\n    <span class="kw">environment</span>:\n      POSTGRES_DB:       justice_cms\n      POSTGRES_USER:     justice_user\n      POSTGRES_PASSWORD: <span class="st">"${DB_PASSWORD}"</span>\n    <span class="kw">ports</span>:\n      - <span class="st">"5432:5432"</span>\n    <span class="kw">volumes</span>:\n      - postgres_data:/var/lib/postgresql/data\n\n<span class="kw">volumes</span>:\n  postgres_data:')}
        ${cb('bash','','<span class="cm"># Start the database</span>\n<span class="fn">docker-compose</span> up -d postgres\n\n<span class="cm"># Connect to it with psql</span>\n<span class="fn">docker-compose</span> exec postgres psql -U justice_user -d justice_cms\n\n<span class="cm"># Or from your host if psql is installed</span>\n<span class="fn">psql</span> -h localhost -U justice_user -d justice_cms')}
        <h2>Core SQL You Must Know</h2>
        ${cb('sql','','<span class="cm">-- Create a table</span>\n<span class="kw">CREATE TABLE</span> cases (\n    id          <span class="fn">SERIAL</span> <span class="kw">PRIMARY KEY</span>,\n    case_number <span class="fn">VARCHAR</span>(50) <span class="kw">UNIQUE NOT NULL</span>,\n    title       <span class="fn">TEXT</span> <span class="kw">NOT NULL</span>,\n    status      <span class="fn">VARCHAR</span>(20) <span class="kw">DEFAULT</span> <span class="st">\'filed\'</span>,\n    created_at  <span class="fn">TIMESTAMP</span> <span class="kw">DEFAULT</span> <span class="fn">NOW</span>()\n);\n\n<span class="cm">-- Insert a row</span>\n<span class="kw">INSERT INTO</span> cases (case_number, title)\n<span class="kw">VALUES</span> (<span class="st">\'2024-CR-001\'</span>, <span class="st">\'State v. Smith\'</span>);\n\n<span class="cm">-- Query with a join</span>\n<span class="kw">SELECT</span> c.title, p.full_name\n<span class="kw">FROM</span> cases c\n<span class="kw">JOIN</span> case_parties cp <span class="kw">ON</span> c.id = cp.case_id\n<span class="kw">JOIN</span> parties      p  <span class="kw">ON</span> p.id = cp.party_id\n<span class="kw">WHERE</span> c.status = <span class="st">\'active\'</span>;\n\n<span class="cm">-- Update with a returning clause</span>\n<span class="kw">UPDATE</span> cases\n<span class="kw">SET</span> status = <span class="st">\'closed\'</span>, closed_at = <span class="fn">NOW</span>()\n<span class="kw">WHERE</span> id = <span class="num">42</span>\n<span class="kw">RETURNING</span> *;')}
        ${quiz(
          'What does SERIAL do in a PostgreSQL CREATE TABLE statement?',
          ['Creates a text field','Creates an auto-incrementing integer primary key','Encrypts the column data','Creates a foreign key reference'],
          1,
          '<code>SERIAL</code> is shorthand for an auto-incrementing integer. PostgreSQL automatically assigns the next value (1, 2, 3, ...) each time you insert a row.'
        )}
      `
    },
    {
      id:'l02', title:'SQLAlchemy ORM & Alembic',
      duration:'35 min',
      intro:'SQLAlchemy lets you work with your database using Python classes instead of raw SQL. Alembic manages schema changes over time — essential for a production system.',
      builds:'All SQLAlchemy models and first Alembic migration',
      content:`
        <h2>SQLAlchemy Models</h2>
        <p>An <strong>ORM</strong> (Object-Relational Mapper) maps database tables to Python classes. Each row becomes an object, each column becomes an attribute. You write Python; SQLAlchemy writes the SQL.</p>
        ${cb('python','app/models/base.py','<span class="kw">from</span> sqlalchemy.orm <span class="kw">import</span> DeclarativeBase\n<span class="kw">from</span> sqlalchemy <span class="kw">import</span> DateTime, func\n<span class="kw">from</span> sqlalchemy.orm <span class="kw">import</span> mapped_column, Mapped\n\n<span class="kw">class</span> <span class="fn">Base</span>(DeclarativeBase):\n    <span class="kw">pass</span>\n\n<span class="kw">class</span> <span class="fn">TimestampMixin</span>:\n    <span class="st">"""Add created_at / updated_at to any model."""</span>\n    created_at: Mapped[<span class="fn">datetime</span>] = <span class="fn">mapped_column</span>(\n        <span class="fn">DateTime</span>(timezone=<span class="kw">True</span>), server_default=<span class="fn">func.now</span>()\n    )\n    updated_at: Mapped[<span class="fn">datetime</span>] = <span class="fn">mapped_column</span>(\n        <span class="fn">DateTime</span>(timezone=<span class="kw">True</span>), onupdate=<span class="fn">func.now</span>(), nullable=<span class="kw">True</span>\n    )')}
        ${cb('python','app/models/case.py','<span class="kw">from</span> sqlalchemy <span class="kw">import</span> String, Text, Enum <span class="kw">as</span> SAEnum, ForeignKey\n<span class="kw">from</span> sqlalchemy.orm <span class="kw">import</span> Mapped, mapped_column, relationship\n<span class="kw">from</span> .base <span class="kw">import</span> Base, TimestampMixin\n<span class="kw">import</span> enum\n\n<span class="kw">class</span> <span class="fn">CaseStatus</span>(enum.Enum):\n    FILED   = <span class="st">"filed"</span>\n    ACTIVE  = <span class="st">"active"</span>\n    PENDING = <span class="st">"pending"</span>\n    CLOSED  = <span class="st">"closed"</span>\n\n<span class="kw">class</span> <span class="fn">Case</span>(Base, TimestampMixin):\n    __tablename__ = <span class="st">"cases"</span>\n\n    id:          Mapped[<span class="fn">int</span>]  = <span class="fn">mapped_column</span>(primary_key=<span class="kw">True</span>)\n    case_number: Mapped[<span class="fn">str</span>]  = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">50</span>), unique=<span class="kw">True</span>)\n    title:       Mapped[<span class="fn">str</span>]  = <span class="fn">mapped_column</span>(<span class="fn">Text</span>)\n    status:      Mapped[<span class="fn">CaseStatus</span>] = <span class="fn">mapped_column</span>(\n        <span class="fn">SAEnum</span>(CaseStatus), default=CaseStatus.FILED\n    )\n\n    <span class="cm"># Relationships</span>\n    parties:  Mapped[list[<span class="st">"Party"</span>]]   = <span class="fn">relationship</span>(<span class="st">"Party"</span>, back_populates=<span class="st">"case"</span>)\n    hearings: Mapped[list[<span class="st">"Hearing"</span>]] = <span class="fn">relationship</span>(<span class="st">"Hearing"</span>, back_populates=<span class="st">"case"</span>)')}
        <h2>Alembic Migrations</h2>
        <p>Alembic tracks your schema changes in version-controlled migration files. Every time you change a model, you create a migration — like git commits but for your database.</p>
        ${cb('bash','','<span class="cm"># Set up Alembic</span>\n<span class="fn">pip</span> install alembic\n<span class="fn">alembic</span> init alembic\n\n<span class="cm"># Create a migration (auto-detects model changes)</span>\n<span class="fn">alembic</span> revision --autogenerate -m <span class="st">"create cases table"</span>\n\n<span class="cm"># Apply migrations</span>\n<span class="fn">alembic</span> upgrade head\n\n<span class="cm"># Roll back one step</span>\n<span class="fn">alembic</span> downgrade -1\n\n<span class="cm"># See current revision</span>\n<span class="fn">alembic</span> current')}
        ${callout('warn','Never edit production data manually','Always use migrations. Manual schema changes break Alembic\'s version tracking and make rollbacks impossible.')}
        ${quiz(
          'What is the purpose of Alembic in a FastAPI project?',
          ['It serves as the web server','It manages database schema version changes','It encrypts database passwords','It handles HTTP authentication'],
          1,
          'Alembic is a database migration tool. It tracks changes to your SQLAlchemy models and generates SQL scripts to update (or rollback) your database schema.'
        )}
        ${exercise('Create the Case Model',`<ul><li>Create <code>app/models/case.py</code> with the <code>Case</code> model shown above</li><li>Run <code>alembic revision --autogenerate -m "create cases table"</code></li><li>Inspect the generated migration file in <code>alembic/versions/</code></li><li>Run <code>alembic upgrade head</code> to apply it</li><li>Connect to psql and run <code>\\dt</code> to verify the table was created</li></ul>`)}
      `
    }
  ]
},


// ─────────────────────────────────────────────────────────────
// MODULE 03 — FastAPI Core
// ─────────────────────────────────────────────────────────────
{
  id:'m03', num:'03', title:'FastAPI Core',
  lessons:[
    {
      id:'l01', title:'Your First FastAPI App',
      duration:'20 min',
      intro:'Write the entry point for JusticeCMS and understand how FastAPI turns Python functions into a full REST API with automatic documentation.',
      builds:'app/main.py — the running FastAPI application',
      content:`
        <h2>What is FastAPI?</h2>
        <p>FastAPI is a modern Python web framework that is <strong>fast to write</strong> (auto docs, type-driven) and <strong>fast at runtime</strong> (async, on par with Node.js and Go). It is built on two libraries: <strong>Starlette</strong> (ASGI web framework) and <strong>Pydantic</strong> (data validation).</p>
        ${callout('key','ASGI vs WSGI','Old Python frameworks (Django, Flask) use WSGI — a synchronous interface. FastAPI uses ASGI, which is the async version. This is why FastAPI can handle thousands of concurrent connections efficiently.')}
        <h2>The Entry Point</h2>
        ${cb('python','app/main.py','<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI\n<span class="kw">from</span> fastapi.middleware.cors <span class="kw">import</span> CORSMiddleware\n<span class="kw">from</span> contextlib <span class="kw">import</span> asynccontextmanager\n\n<span class="kw">from</span> app.core.database <span class="kw">import</span> engine, Base\n<span class="kw">from</span> app.routers <span class="kw">import</span> cases, parties, auth\n\n<span class="dec">@asynccontextmanager</span>\n<span class="kw">async def</span> <span class="fn">lifespan</span>(app: <span class="fn">FastAPI</span>):\n    <span class="cm"># Startup: create tables (use Alembic in production)</span>\n    <span class="kw">async with</span> engine.<span class="fn">begin</span>() <span class="kw">as</span> conn:\n        <span class="kw">await</span> conn.<span class="fn">run_sync</span>(Base.metadata.create_all)\n    <span class="kw">yield</span>\n    <span class="cm"># Shutdown: cleanup</span>\n    <span class="kw">await</span> engine.<span class="fn">dispose</span>()\n\napp = <span class="fn">FastAPI</span>(\n    title=<span class="st">"JusticeCMS API"</span>,\n    description=<span class="st">"Court Management System REST API"</span>,\n    version=<span class="st">"1.0.0"</span>,\n    lifespan=lifespan\n)\n\napp.<span class="fn">add_middleware</span>(\n    CORSMiddleware,\n    allow_origins=[<span class="st">"http://localhost:3000"</span>],\n    allow_credentials=<span class="kw">True</span>,\n    allow_methods=[<span class="st">"*"</span>],\n    allow_headers=[<span class="st">"*"</span>],\n)\n\napp.<span class="fn">include_router</span>(auth.router,    prefix=<span class="st">"/api/v1/auth"</span>)\napp.<span class="fn">include_router</span>(cases.router,   prefix=<span class="st">"/api/v1/cases"</span>)\napp.<span class="fn">include_router</span>(parties.router, prefix=<span class="st">"/api/v1/parties"</span>)\n\n<span class="dec">@app.get</span>(<span class="st">"/"</span>)\n<span class="kw">async def</span> <span class="fn">root</span>():\n    <span class="kw">return</span> {<span class="st">"message"</span>: <span class="st">"JusticeCMS API v1"</span>}')}
        <h2>Running the Server</h2>
        ${cb('bash','','<span class="cm"># Install uvicorn (ASGI server)</span>\n<span class="fn">pip</span> install <span class="st">"uvicorn[standard]"</span>\n\n<span class="cm"># Run in development mode (auto-reload on file changes)</span>\n<span class="fn">uvicorn</span> app.main:app --reload --port 8000\n\n<span class="cm"># Now open:</span>\n<span class="cm"># API:  http://localhost:8000/</span>\n<span class="cm"># Docs: http://localhost:8000/docs  (Swagger UI)</span>\n<span class="cm"># Alt:  http://localhost:8000/redoc (ReDoc)</span>')}
        ${callout('tip','Free Docs!','FastAPI automatically generates interactive API documentation from your code. Go to <code>/docs</code> and you can test every endpoint directly in the browser — no Postman needed.')}
        ${quiz(
          'What does "uvicorn app.main:app" mean?',
          ['Run the file called app.main in the app directory','Load the "app" object from the "app.main" Python module and serve it','Create a new FastAPI application called "app"','Connect to a database named "app.main"'],
          1,
          '<code>uvicorn</code> is the server. <code>app.main</code> is the Python module path (app/main.py). <code>app</code> after the colon is the name of the FastAPI instance inside that module.'
        )}
      `
    },
    {
      id:'l02', title:'Routes, Parameters & Responses',
      duration:'25 min',
      intro:'The building blocks of every API: how to define routes, accept input, and return structured responses with proper HTTP status codes.',
      builds:'Full CRUD endpoints for cases router',
      content:`
        <h2>HTTP Methods & Route Decorators</h2>
        ${cb('python','app/routers/cases.py','<span class="kw">from</span> fastapi <span class="kw">import</span> APIRouter, HTTPException, status, Depends, Query\n<span class="kw">from</span> sqlalchemy.ext.asyncio <span class="kw">import</span> AsyncSession\n<span class="kw">from</span> typing <span class="kw">import</span> List, Optional\n\n<span class="kw">from</span> app.core.database <span class="kw">import</span> get_db\n<span class="kw">from</span> app.schemas.case <span class="kw">import</span> CaseCreate, CaseResponse, CaseUpdate\n<span class="kw">from</span> app.crud.case <span class="kw">import</span> create_case, get_case, list_cases, update_case\n\nrouter = <span class="fn">APIRouter</span>(tags=[<span class="st">"Cases"</span>])\n\n<span class="cm"># GET all cases (with optional filters)</span>\n<span class="dec">@router.get</span>(<span class="st">"/"</span>, response_model=List[CaseResponse])\n<span class="kw">async def</span> <span class="fn">read_cases</span>(\n    status:     Optional[<span class="fn">str</span>] = <span class="fn">Query</span>(<span class="kw">None</span>),\n    skip:       <span class="fn">int</span>           = <span class="fn">Query</span>(<span class="num">0</span>,   ge=<span class="num">0</span>),\n    limit:      <span class="fn">int</span>           = <span class="fn">Query</span>(<span class="num">20</span>,  le=<span class="num">100</span>),\n    db: AsyncSession = <span class="fn">Depends</span>(get_db)\n):\n    <span class="kw">return await</span> <span class="fn">list_cases</span>(db, status=status, skip=skip, limit=limit)\n\n<span class="cm"># GET one case by ID</span>\n<span class="dec">@router.get</span>(<span class="st">"/{case_id}"</span>, response_model=CaseResponse)\n<span class="kw">async def</span> <span class="fn">read_case</span>(case_id: <span class="fn">int</span>, db: AsyncSession = <span class="fn">Depends</span>(get_db)):\n    case = <span class="kw">await</span> <span class="fn">get_case</span>(db, case_id)\n    <span class="kw">if not</span> case:\n        <span class="kw">raise</span> <span class="fn">HTTPException</span>(status_code=<span class="num">404</span>, detail=<span class="st">"Case not found"</span>)\n    <span class="kw">return</span> case\n\n<span class="cm"># POST create a case</span>\n<span class="dec">@router.post</span>(<span class="st">"/"</span>, response_model=CaseResponse, status_code=<span class="fn">status</span>.HTTP_201_CREATED)\n<span class="kw">async def</span> <span class="fn">new_case</span>(payload: CaseCreate, db: AsyncSession = <span class="fn">Depends</span>(get_db)):\n    <span class="kw">return await</span> <span class="fn">create_case</span>(db, payload)\n\n<span class="cm"># PATCH update a case</span>\n<span class="dec">@router.patch</span>(<span class="st">"/{case_id}"</span>, response_model=CaseResponse)\n<span class="kw">async def</span> <span class="fn">edit_case</span>(\n    case_id: <span class="fn">int</span>, payload: CaseUpdate,\n    db: AsyncSession = <span class="fn">Depends</span>(get_db)\n):\n    <span class="kw">return await</span> <span class="fn">update_case</span>(db, case_id, payload)')}
        <h2>Dependency Injection</h2>
        <p>The <code>Depends(get_db)</code> pattern is FastAPI's dependency injection. <code>get_db</code> is a function that yields a database session — FastAPI automatically creates it, passes it in, and closes it when the request is done.</p>
        ${cb('python','app/core/database.py','<span class="kw">from</span> sqlalchemy.ext.asyncio <span class="kw">import</span> create_async_engine, AsyncSession, async_sessionmaker\n<span class="kw">from</span> app.core.config <span class="kw">import</span> settings\n\nengine = <span class="fn">create_async_engine</span>(\n    settings.DATABASE_URL,\n    echo=<span class="kw">False</span>,\n    pool_size=<span class="num">10</span>,\n    max_overflow=<span class="num">20</span>\n)\n\nAsyncSessionLocal = <span class="fn">async_sessionmaker</span>(engine, expire_on_commit=<span class="kw">False</span>)\n\n<span class="kw">async def</span> <span class="fn">get_db</span>():\n    <span class="kw">async with</span> <span class="fn">AsyncSessionLocal</span>() <span class="kw">as</span> session:\n        <span class="kw">try</span>:\n            <span class="kw">yield</span> session\n            <span class="kw">await</span> session.<span class="fn">commit</span>()\n        <span class="kw">except</span> Exception:\n            <span class="kw">await</span> session.<span class="fn">rollback</span>()\n            <span class="kw">raise</span>')}
        ${quiz(
          'What HTTP status code should a successful POST (create) endpoint return?',
          ['200 OK','201 Created','204 No Content','202 Accepted'],
          1,
          '<strong>201 Created</strong> is the correct status for a successful resource creation. <code>200 OK</code> is for successful reads/updates. FastAPI defaults to 200, so we explicitly set <code>status_code=status.HTTP_201_CREATED</code>.'
        )}
      `
    },
    {
      id:'l03', title:'Dependency Injection Deep Dive',
      duration:'20 min',
      intro:'FastAPI\'s dependency injection system is its most powerful feature. Use it for database sessions, authentication, pagination, and any shared logic.',
      builds:'Reusable dependencies: get_db, get_current_user, pagination',
      content:`
        <h2>Dependencies as Building Blocks</h2>
        <p>A dependency is just a callable that FastAPI calls and injects. They can depend on other dependencies, forming a tree.</p>
        ${cb('python','app/core/deps.py','<span class="kw">from</span> fastapi <span class="kw">import</span> Depends, Query\n<span class="kw">from</span> dataclasses <span class="kw">import</span> dataclass\n\n<span class="dec">@dataclass</span>\n<span class="kw">class</span> <span class="fn">Pagination</span>:\n    skip:  <span class="fn">int</span> = <span class="fn">Query</span>(<span class="num">0</span>,   ge=<span class="num">0</span>,   description=<span class="st">"Records to skip"</span>)\n    limit: <span class="fn">int</span> = <span class="fn">Query</span>(<span class="num">20</span>,  le=<span class="num">100</span>, description=<span class="st">"Max records to return"</span>)\n\n<span class="cm"># Use it in any route:</span>\n<span class="dec">@router.get</span>(<span class="st">"/"</span>)\n<span class="kw">async def</span> <span class="fn">list_items</span>(page: Pagination = <span class="fn">Depends</span>()):\n    <span class="kw">return</span> <span class="kw">await</span> <span class="fn">get_items</span>(skip=page.skip, limit=page.limit)')}
        ${callout('tip','Depends() is reusable','Write a dependency once, use it in 50 routes. When your auth logic changes, you update one function and every protected route is automatically updated.')}
        ${quiz(
          'What is the benefit of using Depends() for database sessions?',
          ['It makes queries faster','FastAPI automatically handles session creation, commit, and rollback for every request','It encrypts database connections','It caches query results'  ],
          1,
          'With <code>Depends(get_db)</code>, FastAPI creates a fresh database session per request, and the <code>get_db</code> generator commits on success and rolls back on any exception — automatically.'
        )}
      `
    }
  ]
},


// ─────────────────────────────────────────────────────────────
// MODULE 04 — JWT Auth & RBAC
// ─────────────────────────────────────────────────────────────
{
  id:'m04', num:'04', title:'JWT Auth & Role-Based Access Control',
  lessons:[
    {
      id:'l01', title:'Password Hashing & JWT Tokens',
      duration:'30 min',
      intro:'Authentication is the front door of JusticeCMS. Judges, clerks, attorneys, and the public all get different access levels. Learn how JWT authentication works and how to implement it securely.',
      builds:'app/core/security.py — hashing, token creation, token validation',
      content:`
        <h2>Never Store Plaintext Passwords</h2>
        <p>If your database is ever breached, you don't want the attacker to have everyone's passwords. We hash passwords using <strong>bcrypt</strong>, a slow algorithm designed specifically to make brute-force attacks expensive.</p>
        ${cb('python','app/core/security.py','<span class="kw">from</span> passlib.context <span class="kw">import</span> CryptContext\n<span class="kw">from</span> jose <span class="kw">import</span> jwt, JWTError\n<span class="kw">from</span> datetime <span class="kw">import</span> datetime, timedelta, timezone\n<span class="kw">from</span> app.core.config <span class="kw">import</span> settings\n\npwd_context = <span class="fn">CryptContext</span>(schemes=[<span class="st">"bcrypt"</span>], deprecated=<span class="st">"auto"</span>)\n\n<span class="kw">def</span> <span class="fn">hash_password</span>(password: <span class="fn">str</span>) -> <span class="fn">str</span>:\n    <span class="kw">return</span> pwd_context.<span class="fn">hash</span>(password)\n\n<span class="kw">def</span> <span class="fn">verify_password</span>(plain: <span class="fn">str</span>, hashed: <span class="fn">str</span>) -> <span class="fn">bool</span>:\n    <span class="kw">return</span> pwd_context.<span class="fn">verify</span>(plain, hashed)\n\n<span class="kw">def</span> <span class="fn">create_access_token</span>(subject: <span class="fn">str</span>, role: <span class="fn">str</span>) -> <span class="fn">str</span>:\n    expire = <span class="fn">datetime.now</span>(timezone.utc) + <span class="fn">timedelta</span>(\n        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES\n    )\n    payload = {\n        <span class="st">"sub"</span>: subject,  <span class="cm"># subject — usually user_id</span>\n        <span class="st">"role"</span>: role,\n        <span class="st">"exp"</span>: expire,\n        <span class="st">"iat"</span>: <span class="fn">datetime.now</span>(timezone.utc)\n    }\n    <span class="kw">return</span> jwt.<span class="fn">encode</span>(payload, settings.SECRET_KEY, algorithm=<span class="st">"HS256"</span>)\n\n<span class="kw">def</span> <span class="fn">decode_token</span>(token: <span class="fn">str</span>) -> <span class="fn">dict</span>:\n    <span class="kw">try</span>:\n        <span class="kw">return</span> jwt.<span class="fn">decode</span>(token, settings.SECRET_KEY, algorithms=[<span class="st">"HS256"</span>])\n    <span class="kw">except</span> JWTError:\n        <span class="kw">raise</span> <span class="fn">HTTPException</span>(status_code=<span class="num">401</span>, detail=<span class="st">"Invalid token"</span>)')}
        <h2>What is a JWT?</h2>
        <p>A <strong>JSON Web Token</strong> is a self-contained credential. It has three parts separated by dots: <code>header.payload.signature</code>. The server signs it with a secret key. Any server that knows the secret can verify the token — without hitting the database on every request.</p>
        ${callout('warn','JWT is not encrypted','The payload (user ID, role) is just Base64-encoded — anyone can read it. Never put sensitive data in a JWT. The security comes from the signature: only the server with the secret key can create a valid token.')}
        ${quiz(
          'Why do we use bcrypt instead of SHA-256 for password hashing?',
          ['bcrypt produces shorter hashes','bcrypt is intentionally slow, making brute-force attacks expensive','bcrypt is reversible so we can recover passwords','bcrypt is the only algorithm supported by Python'],
          1,
          'bcrypt is designed to be slow (configurable cost factor). A modern GPU can compute billions of SHA-256 hashes per second, but only thousands of bcrypt hashes. This makes brute-forcing a leaked password database impractical.'
        )}
      `
    },
    {
      id:'l02', title:'OAuth2 Flow & Protected Routes',
      duration:'25 min',
      intro:'Wire up the login endpoint and protect routes so only authenticated users can access them.',
      builds:'app/routers/auth.py — login endpoint and auth dependency',
      content:`
        <h2>The Login Flow</h2>
        <p>1. User sends <code>POST /auth/token</code> with username and password.<br>2. Server verifies credentials, returns a JWT.<br>3. Client stores token, sends it in every future request as <code>Authorization: Bearer &lt;token&gt;</code>.<br>4. Server validates token on each request.</p>
        ${cb('python','app/routers/auth.py','<span class="kw">from</span> fastapi <span class="kw">import</span> APIRouter, Depends, HTTPException, status\n<span class="kw">from</span> fastapi.security <span class="kw">import</span> OAuth2PasswordBearer, OAuth2PasswordRequestForm\n<span class="kw">from</span> sqlalchemy.ext.asyncio <span class="kw">import</span> AsyncSession\n\n<span class="kw">from</span> app.core.database <span class="kw">import</span> get_db\n<span class="kw">from</span> app.core.security <span class="kw">import</span> verify_password, create_access_token, decode_token\n<span class="kw">from</span> app.crud.user <span class="kw">import</span> get_user_by_email\n\nrouter = <span class="fn">APIRouter</span>()\noauth2_scheme = <span class="fn">OAuth2PasswordBearer</span>(tokenUrl=<span class="st">"/api/v1/auth/token"</span>)\n\n<span class="dec">@router.post</span>(<span class="st">"/token"</span>)\n<span class="kw">async def</span> <span class="fn">login</span>(\n    form: OAuth2PasswordRequestForm = <span class="fn">Depends</span>(),\n    db:   AsyncSession               = <span class="fn">Depends</span>(get_db)\n):\n    user = <span class="kw">await</span> <span class="fn">get_user_by_email</span>(db, form.username)\n    <span class="kw">if not</span> user <span class="kw">or not</span> <span class="fn">verify_password</span>(form.password, user.password_hash):\n        <span class="kw">raise</span> <span class="fn">HTTPException</span>(\n            status_code=status.HTTP_401_UNAUTHORIZED,\n            detail=<span class="st">"Invalid credentials"</span>,\n            headers={<span class="st">"WWW-Authenticate"</span>: <span class="st">"Bearer"</span>},\n        )\n    token = <span class="fn">create_access_token</span>(<span class="fn">str</span>(user.id), user.role.value)\n    <span class="kw">return</span> {<span class="st">"access_token"</span>: token, <span class="st">"token_type"</span>: <span class="st">"bearer"</span>}\n\n<span class="kw">async def</span> <span class="fn">get_current_user</span>(\n    token: <span class="fn">str</span>          = <span class="fn">Depends</span>(oauth2_scheme),\n    db:    AsyncSession = <span class="fn">Depends</span>(get_db)\n):\n    payload = <span class="fn">decode_token</span>(token)\n    user    = <span class="kw">await</span> <span class="fn">get_user_by_id</span>(db, <span class="fn">int</span>(payload[<span class="st">"sub"</span>]))\n    <span class="kw">if not</span> user:\n        <span class="kw">raise</span> <span class="fn">HTTPException</span>(status_code=<span class="num">401</span>, detail=<span class="st">"User not found"</span>)\n    <span class="kw">return</span> user')}
        <h2>Role-Based Access Control (RBAC)</h2>
        ${cb('python','app/core/rbac.py','<span class="kw">from</span> fastapi <span class="kw">import</span> HTTPException, status\n<span class="kw">from</span> functools <span class="kw">import</span> wraps\n\n<span class="kw">def</span> <span class="fn">require_role</span>(*roles: <span class="fn">str</span>):\n    <span class="st">"""Dependency factory: only allow users with specified roles."""</span>\n    <span class="kw">def</span> <span class="fn">dependency</span>(current_user = <span class="fn">Depends</span>(get_current_user)):\n        <span class="kw">if</span> current_user.role.value <span class="kw">not in</span> roles:\n            <span class="kw">raise</span> <span class="fn">HTTPException</span>(\n                status_code=status.HTTP_403_FORBIDDEN,\n                detail=<span class="st">f"Role {current_user.role.value!r} cannot access this resource"</span>\n            )\n        <span class="kw">return</span> current_user\n    <span class="kw">return</span> dependency\n\n<span class="cm"># Usage in routes:</span>\n<span class="dec">@router.post</span>(<span class="st">"/warrant"</span>)\n<span class="kw">async def</span> <span class="fn">issue_warrant</span>(\n    payload: WarrantCreate,\n    user = <span class="fn">Depends</span>(<span class="fn">require_role</span>(<span class="st">"judge"</span>, <span class="st">"admin"</span>))\n):\n    ...')}
        ${quiz(
          'A request arrives with no Authorization header. What HTTP status should be returned?',
          ['400 Bad Request','403 Forbidden','401 Unauthorized','404 Not Found'],
          2,
          '<strong>401 Unauthorized</strong> means the client has not authenticated. <strong>403 Forbidden</strong> means the client IS authenticated but lacks permission. No token at all = 401.'
        )}
      `
    }
  ]
},


// ─────────────────────────────────────────────────────────────
// MODULE 05 — Case Management API
// ─────────────────────────────────────────────────────────────
{
  id:'m05', num:'05', title:'Case Management API',
  lessons:[
    {
      id:'l01', title:'Case Lifecycle & State Machine',
      duration:'25 min',
      intro:'A court case isn\'t just a database row — it has a lifecycle. It is filed, goes active, may be pending, and eventually closes. Implementing this as a state machine prevents invalid transitions.',
      builds:'Case status state machine with transition validation',
      content:`
        <h2>The Case Lifecycle</h2>
        <p>Every JusticeCMS case moves through a defined sequence of states. Not every transition is valid — a closed case cannot go back to filed. Enforcing this prevents data corruption.</p>
        ${cb('python','app/models/case.py','<span class="kw">from</span> enum <span class="kw">import</span> Enum\n\n<span class="kw">class</span> <span class="fn">CaseStatus</span>(str, Enum):\n    FILED    = <span class="st">"filed"</span>    <span class="cm"># initial state</span>\n    ACTIVE   = <span class="st">"active"</span>   <span class="cm"># case is being heard</span>\n    PENDING  = <span class="st">"pending"</span>  <span class="cm"># awaiting action / evidence</span>\n    APPEALED = <span class="st">"appealed"</span> <span class="cm"># under appeal</span>\n    CLOSED   = <span class="st">"closed"</span>   <span class="cm"># final state</span>\n\n<span class="cm"># Valid transitions: from_status -> [allowed_to_statuses]</span>\nVALID_TRANSITIONS = {\n    CaseStatus.FILED:    [CaseStatus.ACTIVE],\n    CaseStatus.ACTIVE:   [CaseStatus.PENDING, CaseStatus.CLOSED],\n    CaseStatus.PENDING:  [CaseStatus.ACTIVE,  CaseStatus.CLOSED],\n    CaseStatus.CLOSED:   [CaseStatus.APPEALED],\n    CaseStatus.APPEALED: [CaseStatus.ACTIVE,  CaseStatus.CLOSED],\n}\n\n<span class="kw">def</span> <span class="fn">validate_transition</span>(current: CaseStatus, new: CaseStatus):\n    <span class="kw">if</span> new <span class="kw">not in</span> VALID_TRANSITIONS.get(current, []):\n        <span class="kw">raise</span> ValueError(\n            <span class="st">f"Cannot transition case from {current.value!r} to {new.value!r}"</span>\n        )')}
        <h2>CRUD Operations</h2>
        ${cb('python','app/crud/case.py','<span class="kw">from</span> sqlalchemy.ext.asyncio <span class="kw">import</span> AsyncSession\n<span class="kw">from</span> sqlalchemy <span class="kw">import</span> select, update\n<span class="kw">from</span> app.models.case <span class="kw">import</span> Case, validate_transition\n<span class="kw">from</span> app.schemas.case <span class="kw">import</span> CaseCreate, CaseUpdate\n\n<span class="kw">async def</span> <span class="fn">create_case</span>(db: AsyncSession, data: CaseCreate) -> Case:\n    case_num = <span class="kw">await</span> <span class="fn">generate_case_number</span>(db)\n    case = <span class="fn">Case</span>(**data.model_dump(), case_number=case_num)\n    db.<span class="fn">add</span>(case)\n    <span class="kw">await</span> db.<span class="fn">flush</span>()   <span class="cm"># get the auto-assigned ID</span>\n    <span class="kw">await</span> <span class="fn">create_audit_log</span>(db, case.id, <span class="st">"created"</span>)\n    <span class="kw">return</span> case\n\n<span class="kw">async def</span> <span class="fn">update_case_status</span>(\n    db: AsyncSession, case_id: <span class="fn">int</span>, new_status: CaseStatus\n) -> Case:\n    case = <span class="kw">await</span> <span class="fn">get_case</span>(db, case_id)\n    <span class="kw">if not</span> case:\n        <span class="kw">raise</span> <span class="fn">HTTPException</span>(<span class="num">404</span>, <span class="st">"Case not found"</span>)\n    <span class="fn">validate_transition</span>(case.status, new_status)  <span class="cm"># raises ValueError on invalid</span>\n    case.status = new_status\n    <span class="kw">await</span> <span class="fn">create_audit_log</span>(db, case.id, <span class="st">f"status → {new_status.value}"</span>)\n    <span class="kw">return</span> case')}
        ${quiz(
          'Why model case status changes as a state machine?',
          ['It makes the code run faster','It prevents invalid status transitions (e.g. re-opening a closed case)','It encrypts the status field','It enables caching of case data'],
          1,
          'A state machine defines which transitions are legal. Without it, code anywhere in the system could set any status at any time, leading to impossible case states (e.g., a case that is simultaneously filed and closed).'
        )}
        ${exercise('Add Audit Logging',`<p>Every status change in JusticeCMS must be auditable. Create a <code>case_audit_log</code> table with:</p><ul><li><code>id</code>, <code>case_id</code> (FK), <code>user_id</code> (FK), <code>action</code> (text), <code>timestamp</code></li></ul><p>Then update <code>update_case_status</code> to write an audit entry on every successful transition.</p>`)}
      `
    }
  ]
},

// ─────────────────────────────────────────────────────────────
// MODULE 06 — Party Registry
// ─────────────────────────────────────────────────────────────
{
  id:'m06', num:'06', title:'Party Registry',
  lessons:[
    {
      id:'l01', title:'Parties, Roles & Relationships',
      duration:'30 min',
      intro:'A case involves many people: plaintiffs, defendants, witnesses, judges, and attorneys. The party registry manages them all and links them to cases.',
      builds:'Party model, case_parties join table, search endpoint',
      content:`
        <h2>The Many-to-Many Relationship</h2>
        <p>A party (person or organisation) can be involved in many cases, and a case can have many parties. This is a <strong>many-to-many</strong> relationship — we model it with a join table that also stores the party's <em>role</em> in each case.</p>
        ${cb('python','app/models/party.py','<span class="kw">from</span> sqlalchemy <span class="kw">import</span> ForeignKey, String, Enum <span class="kw">as</span> SAEnum\n<span class="kw">from</span> sqlalchemy.orm <span class="kw">import</span> Mapped, mapped_column, relationship\n<span class="kw">from</span> .base <span class="kw">import</span> Base, TimestampMixin\n<span class="kw">import</span> enum\n\n<span class="kw">class</span> <span class="fn">PartyRole</span>(str, enum.Enum):\n    PLAINTIFF  = <span class="st">"plaintiff"</span>\n    DEFENDANT  = <span class="st">"defendant"</span>\n    WITNESS    = <span class="st">"witness"</span>\n    ATTORNEY   = <span class="st">"attorney"</span>\n    JUDGE      = <span class="st">"judge"</span>\n\n<span class="kw">class</span> <span class="fn">Party</span>(Base, TimestampMixin):\n    __tablename__ = <span class="st">"parties"</span>\n    id:        Mapped[<span class="fn">int</span>] = <span class="fn">mapped_column</span>(primary_key=<span class="kw">True</span>)\n    full_name: Mapped[<span class="fn">str</span>] = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">200</span>))\n    email:     Mapped[<span class="fn">str</span>] = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">200</span>), nullable=<span class="kw">True</span>)\n    phone:     Mapped[<span class="fn">str</span>] = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">30</span>),  nullable=<span class="kw">True</span>)\n    case_links: Mapped[list[<span class="st">"CaseParty"</span>]] = <span class="fn">relationship</span>(back_populates=<span class="st">"party"</span>)\n\n<span class="kw">class</span> <span class="fn">CaseParty</span>(Base):\n    <span class="st">"""Join table: who is involved in which case, and in what role."""</span>\n    __tablename__ = <span class="st">"case_parties"</span>\n    case_id:  Mapped[<span class="fn">int</span>]       = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"cases.id"</span>),   primary_key=<span class="kw">True</span>)\n    party_id: Mapped[<span class="fn">int</span>]       = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"parties.id"</span>), primary_key=<span class="kw">True</span>)\n    role:     Mapped[<span class="fn">PartyRole</span>] = <span class="fn">mapped_column</span>(<span class="fn">SAEnum</span>(PartyRole))\n    case:     Mapped[<span class="st">"Case"</span>]   = <span class="fn">relationship</span>(back_populates=<span class="st">"party_links"</span>)\n    party:    Mapped[<span class="st">"Party"</span>]  = <span class="fn">relationship</span>(back_populates=<span class="st">"case_links"</span>)')}
        <h2>Full-Text Search</h2>
        ${cb('python','app/crud/party.py','<span class="kw">async def</span> <span class="fn">search_parties</span>(\n    db: AsyncSession, query: <span class="fn">str</span>, skip: <span class="fn">int</span> = <span class="num">0</span>, limit: <span class="fn">int</span> = <span class="num">20</span>\n) -> list[Party]:\n    <span class="cm"># PostgreSQL ILIKE for case-insensitive search</span>\n    result = <span class="kw">await</span> db.<span class="fn">execute</span>(\n        <span class="fn">select</span>(Party)\n        .<span class="fn">where</span>(Party.full_name.<span class="fn">ilike</span>(<span class="st">f"%{query}%"</span>))\n        .<span class="fn">offset</span>(skip)\n        .<span class="fn">limit</span>(limit)\n    )\n    <span class="kw">return</span> result.<span class="fn">scalars</span>().<span class="fn">all</span>()')}
        ${quiz(
          'What is a join table (association table) used for?',
          ['To speed up single-table queries','To model many-to-many relationships between two entities','To store temporary session data','To cache frequently accessed records'],
          1,
          'A join table stores the relationship between two entities in a many-to-many situation. In our case: one party can be in many cases, and one case can have many parties — the <code>case_parties</code> table stores each combination with its role.'
        )}
      `
    }
  ]
},


// ─────────────────────────────────────────────────────────────
// MODULE 07 — Documents & PDFs
// ─────────────────────────────────────────────────────────────
{
  id:'m07', num:'07', title:'Documents & PDF Generation',
  lessons:[
    {
      id:'l01', title:'File Uploads with FastAPI',
      duration:'25 min',
      intro:'Court cases are drowning in paper. JusticeCMS replaces that with a secure digital document vault — upload evidence, generate official PDFs, and track every file with an audit trail.',
      builds:'Document upload endpoint + MinIO/S3 storage integration',
      content:`
        <h2>Handling File Uploads</h2>
        <p>FastAPI uses <code>UploadFile</code> for multipart file uploads. We don't store files in the database — we store them in object storage (like AWS S3 or self-hosted MinIO) and save only the reference in PostgreSQL.</p>
        ${cb('python','app/routers/documents.py','<span class="kw">from</span> fastapi <span class="kw">import</span> APIRouter, UploadFile, File, Depends, HTTPException\n<span class="kw">from</span> app.core.storage <span class="kw">import</span> upload_to_s3\n<span class="kw">from</span> app.core.deps <span class="kw">import</span> get_current_user\n<span class="kw">import</span> uuid, mimetypes\n\nrouter = <span class="fn">APIRouter</span>()\n\nALLOWED_TYPES = {<span class="st">"application/pdf"</span>, <span class="st">"image/jpeg"</span>, <span class="st">"image/png"</span>}\nMAX_SIZE_MB   = <span class="num">25</span>\n\n<span class="dec">@router.post</span>(<span class="st">"/{case_id}/documents"</span>)\n<span class="kw">async def</span> <span class="fn">upload_document</span>(\n    case_id:  <span class="fn">int</span>,\n    file:     UploadFile = <span class="fn">File</span>(...),\n    db:       AsyncSession = <span class="fn">Depends</span>(get_db),\n    user      = <span class="fn">Depends</span>(get_current_user)\n):\n    <span class="cm"># Validate content type</span>\n    <span class="kw">if</span> file.content_type <span class="kw">not in</span> ALLOWED_TYPES:\n        <span class="kw">raise</span> <span class="fn">HTTPException</span>(<span class="num">400</span>, <span class="st">"File type not allowed"</span>)\n\n    <span class="cm"># Read and check size</span>\n    data = <span class="kw">await</span> file.<span class="fn">read</span>()\n    <span class="kw">if</span> <span class="fn">len</span>(data) > MAX_SIZE_MB * <span class="num">1024</span> * <span class="num">1024</span>:\n        <span class="kw">raise</span> <span class="fn">HTTPException</span>(<span class="num">413</span>, <span class="st">"File too large"</span>)\n\n    <span class="cm"># Generate a unique storage key</span>\n    ext = file.filename.<span class="fn">rsplit</span>(<span class="st">"."</span>, <span class="num">1</span>)[-<span class="num">1</span>].lower()\n    key = <span class="st">f"cases/{case_id}/{uuid.uuid4()}.{ext}"</span>\n\n    <span class="cm"># Upload to object storage</span>\n    url = <span class="kw">await</span> <span class="fn">upload_to_s3</span>(key, data, file.content_type)\n\n    <span class="cm"># Save reference in DB</span>\n    doc = <span class="kw">await</span> <span class="fn">create_document</span>(db, case_id, file.filename, key, url, user.id)\n    <span class="kw">return</span> doc')}
        ${callout('warn','Validate Everything','Never trust the <code>content_type</code> header alone — a malicious user can set any value. In production, use a library like <code>python-magic</code> to inspect the actual file bytes.')}
        <h2>Generating PDFs</h2>
        ${cb('python','app/services/pdf.py','<span class="kw">from</span> weasyprint <span class="kw">import</span> HTML\n<span class="kw">from</span> jinja2 <span class="kw">import</span> Environment, FileSystemLoader\n\ntemplates = <span class="fn">Environment</span>(<span class="fn">FileSystemLoader</span>(<span class="st">"app/templates"</span>))\n\n<span class="kw">async def</span> <span class="fn">generate_summons_pdf</span>(case: Case, party: Party) -> <span class="fn">bytes</span>:\n    <span class="st">"""Render a Jinja2 HTML template and convert to PDF with WeasyPrint."""</span>\n    template = templates.<span class="fn">get_template</span>(<span class="st">"summons.html"</span>)\n    html_str  = template.<span class="fn">render</span>(case=case, party=party, date=<span class="fn">today</span>())\n    pdf_bytes = <span class="fn">HTML</span>(string=html_str).<span class="fn">write_pdf</span>()\n    <span class="kw">return</span> pdf_bytes')}
        ${quiz(
          'Why store files in object storage (S3/MinIO) instead of the database?',
          ['Databases cannot store binary data','Object storage is cheaper, scales better, and avoids bloating the database with large files','Object storage is faster to query with SQL','It is required by FastAPI'],
          1,
          'Storing files in a database bloats it enormously, slows down backups, and adds pressure on the DB server. Object storage is designed for large binary files, scales infinitely, serves files directly via URL, and costs a fraction of database storage.'
        )}
      `
    }
  ]
},

// ─────────────────────────────────────────────────────────────
// MODULE 08 — Hearing Scheduler
// ─────────────────────────────────────────────────────────────
{
  id:'m08', num:'08', title:'Hearing Scheduler',
  lessons:[
    {
      id:'l01', title:'Calendar API & Conflict Detection',
      duration:'30 min',
      intro:'Schedule hearings, detect double-bookings, and export calendars. The hearing scheduler is the beating heart of a court\'s daily operations.',
      builds:'Hearing model, scheduling endpoints, conflict detection logic',
      content:`
        <h2>The Hearing Model</h2>
        ${cb('python','app/models/hearing.py','<span class="kw">from</span> sqlalchemy <span class="kw">import</span> ForeignKey, DateTime, String\n<span class="kw">from</span> sqlalchemy.orm <span class="kw">import</span> Mapped, mapped_column, relationship\n<span class="kw">from</span> .base <span class="kw">import</span> Base, TimestampMixin\n\n<span class="kw">class</span> <span class="fn">Hearing</span>(Base, TimestampMixin):\n    __tablename__ = <span class="st">"hearings"</span>\n    id:          Mapped[<span class="fn">int</span>]      = <span class="fn">mapped_column</span>(primary_key=<span class="kw">True</span>)\n    case_id:     Mapped[<span class="fn">int</span>]      = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"cases.id"</span>))\n    courtroom:   Mapped[<span class="fn">str</span>]      = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">50</span>))\n    judge_id:    Mapped[<span class="fn">int</span>]      = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"users.id"</span>))\n    starts_at:   Mapped[<span class="fn">datetime</span>] = <span class="fn">mapped_column</span>(<span class="fn">DateTime</span>(timezone=<span class="kw">True</span>))\n    ends_at:     Mapped[<span class="fn">datetime</span>] = <span class="fn">mapped_column</span>(<span class="fn">DateTime</span>(timezone=<span class="kw">True</span>))\n    notes:       Mapped[<span class="fn">str</span>]      = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">500</span>), nullable=<span class="kw">True</span>)\n\n    case:  Mapped[<span class="st">"Case"</span>] = <span class="fn">relationship</span>(back_populates=<span class="st">"hearings"</span>)\n    judge: Mapped[<span class="st">"User"</span>] = <span class="fn">relationship</span>(foreign_keys=[judge_id])')}
        <h2>Conflict Detection</h2>
        <p>Before scheduling a hearing, we must check that the courtroom and judge are both free. Two time ranges overlap if start1 < end2 AND start2 < end1.</p>
        ${cb('python','app/crud/hearing.py','<span class="kw">async def</span> <span class="fn">check_conflicts</span>(\n    db:        AsyncSession,\n    courtroom: <span class="fn">str</span>,\n    judge_id:  <span class="fn">int</span>,\n    starts_at: datetime,\n    ends_at:   datetime,\n    exclude_id: Optional[<span class="fn">int</span>] = <span class="kw">None</span>\n) -> list[Hearing]:\n    q = <span class="fn">select</span>(Hearing).<span class="fn">where</span>(\n        <span class="cm"># Overlap condition: not (ends_at <= starts_at OR starts_at >= ends_at)</span>\n        Hearing.starts_at < ends_at,\n        Hearing.ends_at   > starts_at,\n        (Hearing.courtroom == courtroom) | (Hearing.judge_id == judge_id)\n    )\n    <span class="kw">if</span> exclude_id:\n        q = q.<span class="fn">where</span>(Hearing.id != exclude_id)\n    result = <span class="kw">await</span> db.<span class="fn">execute</span>(q)\n    <span class="kw">return</span> result.<span class="fn">scalars</span>().<span class="fn">all</span>()')}
        ${quiz(
          'Two hearings overlap if:',
          ['They are in the same courtroom','hearing1.start < hearing2.end AND hearing2.start < hearing1.end','hearing1.start == hearing2.start','hearing1.end == hearing2.end'],
          1,
          'The overlap formula is: <strong>A.start &lt; B.end AND B.start &lt; A.end</strong>. This correctly catches all partial and full overlaps. Drawing two timeline bars and testing edge cases confirms this.'
        )}
      `
    }
  ]
},


// ─────────────────────────────────────────────────────────────
// MODULE 09 — Celery & Redis
// ─────────────────────────────────────────────────────────────
{
  id:'m09', num:'09', title:'Celery & Redis — Background Tasks',
  lessons:[
    {
      id:'l01', title:'Why Background Tasks?',
      duration:'20 min',
      intro:'Some things should not make a user wait. Sending an email, generating a PDF report, or running a bulk update — these belong in a background worker.',
      builds:'Celery worker setup + Redis broker in docker-compose',
      content:`
        <h2>The Problem with Synchronous Work</h2>
        <p>Imagine a user files a new case and your API has to: save the case, send email to all parties, generate a PDF docket, and post a notification to the clerk's dashboard. If you do all this synchronously, the user waits 10+ seconds for the response. That's unacceptable.</p>
        ${callout('key','The Pattern','API endpoint does the minimum (save to DB, return 201). Then it <em>dispatches</em> a task to a queue. A background worker picks it up and does the heavy work independently.')}
        <h2>Architecture</h2>
        ${cb('yaml','docker-compose.yml (additions)','<span class="kw">redis</span>:\n  image: redis:7-alpine\n  <span class="kw">ports</span>: [<span class="st">"6379:6379"</span>]\n\n<span class="kw">celery_worker</span>:\n  build: .\n  command: celery -A app.worker worker --loglevel=info --concurrency=4\n  <span class="kw">depends_on</span>: [redis, postgres]\n  <span class="kw">environment</span>:\n    CELERY_BROKER_URL: redis://redis:6379/0\n    DATABASE_URL: <span class="st">"${DATABASE_URL}"</span>\n\n<span class="kw">celery_beat</span>:\n  build: .\n  command: celery -A app.worker beat --loglevel=info\n  <span class="kw">depends_on</span>: [redis]')}
        ${cb('python','app/worker.py','<span class="kw">from</span> celery <span class="kw">import</span> Celery\n<span class="kw">from</span> app.core.config <span class="kw">import</span> settings\n\ncelery_app = <span class="fn">Celery</span>(\n    <span class="st">"justice_cms"</span>,\n    broker=settings.CELERY_BROKER_URL,\n    backend=settings.CELERY_RESULT_BACKEND,\n)\n\ncelery_app.conf.<span class="fn">update</span>(\n    task_serializer=<span class="st">"json"</span>,\n    result_serializer=<span class="st">"json"</span>,\n    accept_content=[<span class="st">"json"</span>],\n    timezone=<span class="st">"UTC"</span>,\n)')}
        ${quiz(
          'What is the role of Redis in a Celery setup?',
          ['It stores user session data','It acts as the message broker — storing the task queue between the API and workers','It caches database query results','It runs the background tasks directly'],
          1,
          'Redis is the <strong>message broker</strong>. The FastAPI app pushes tasks into Redis (the queue). Celery workers pull tasks from Redis and execute them. Redis is the middleman that decouples the producer (API) from the consumer (worker).'
        )}
      `
    },
    {
      id:'l02', title:'Writing & Dispatching Tasks',
      duration:'25 min',
      intro:'Write real Celery tasks: send hearing notifications, generate reports, and schedule recurring jobs.',
      builds:'Notification tasks: email on new hearing, reminder 24h before',
      content:`
        <h2>A Notification Task</h2>
        ${cb('python','app/tasks/notifications.py','<span class="kw">from</span> app.worker <span class="kw">import</span> celery_app\n<span class="kw">from</span> app.core.email <span class="kw">import</span> send_email\n<span class="kw">import</span> logging\n\nlogger = logging.<span class="fn">getLogger</span>(__name__)\n\n<span class="dec">@celery_app.task</span>(bind=<span class="kw">True</span>, max_retries=<span class="num">3</span>, default_retry_delay=<span class="num">60</span>)\n<span class="kw">def</span> <span class="fn">notify_hearing_scheduled</span>(self, hearing_id: <span class="fn">int</span>):\n    <span class="st">"""Send email notifications to all parties when a hearing is scheduled."""</span>\n    <span class="kw">try</span>:\n        <span class="cm"># Use a sync DB session inside the task</span>\n        <span class="kw">with</span> <span class="fn">get_sync_db</span>() <span class="kw">as</span> db:\n            hearing = <span class="fn">get_hearing_sync</span>(db, hearing_id)\n            parties = <span class="fn">get_case_parties_sync</span>(db, hearing.case_id)\n\n            <span class="kw">for</span> party <span class="kw">in</span> parties:\n                <span class="kw">if</span> party.email:\n                    <span class="fn">send_email</span>(\n                        to=party.email,\n                        subject=<span class="st">f"Hearing Scheduled: {hearing.case.title}"</span>,\n                        body=<span class="fn">render_template</span>(<span class="st">"email/hearing.html"</span>, hearing=hearing, party=party)\n                    )\n        logger.<span class="fn">info</span>(<span class="st">f"Notified {len(parties)} parties for hearing {hearing_id}"</span>)\n    <span class="kw">except</span> Exception <span class="kw">as</span> e:\n        logger.<span class="fn">error</span>(<span class="st">f"Notification failed: {e}"</span>)\n        <span class="kw">raise</span> self.<span class="fn">retry</span>(exc=e)  <span class="cm"># auto-retry with backoff</span>\n\n<span class="cm"># Dispatch from the hearing creation endpoint:</span>\n<span class="cm"># notify_hearing_scheduled.delay(hearing.id)</span>')}
        <h2>Scheduled / Periodic Tasks</h2>
        ${cb('python','app/worker.py (additions)','<span class="kw">from</span> celery.schedules <span class="kw">import</span> crontab\n\ncelery_app.conf.beat_schedule = {\n    <span class="cm"># Run every morning at 8am</span>\n    <span class="st">"send-hearing-reminders"</span>: {\n        <span class="st">"task"</span>: <span class="st">"app.tasks.reminders.send_24h_reminders"</span>,\n        <span class="st">"schedule"</span>: <span class="fn">crontab</span>(hour=<span class="num">8</span>, minute=<span class="num">0</span>),\n    },\n    <span class="cm"># Run every hour</span>\n    <span class="st">"archive-old-cases"</span>: {\n        <span class="st">"task"</span>: <span class="st">"app.tasks.maintenance.archive_closed_cases"</span>,\n        <span class="st">"schedule"</span>: <span class="fn">crontab</span>(minute=<span class="num">0</span>),\n    },\n}')}
        ${quiz(
          'What does bind=True mean on a Celery task?',
          ['It binds the task to a specific worker','It gives the task access to "self" — the task instance, enabling retries','It prevents the task from being called asynchronously','It binds the task to a specific database connection'],
          1,
          '<code>bind=True</code> passes the task instance as the first argument (<code>self</code>). This lets you call <code>self.retry(exc=e)</code> to retry the task on failure, and access metadata like <code>self.request.id</code>.'
        )}
      `
    }
  ]
},


// ─────────────────────────────────────────────────────────────
// MODULE 10 — Evidence & Chain of Custody
// ─────────────────────────────────────────────────────────────
{
  id:'m10', num:'10', title:'Evidence & Chain of Custody',
  lessons:[
    {
      id:'l01', title:'Tamper-Proof Evidence Registry',
      duration:'30 min',
      intro:'In a court of law, evidence integrity is everything. Every piece of evidence must be tracked, and every access or transfer must be recorded in a tamper-proof audit chain.',
      builds:'Evidence model + chain-of-custody audit table',
      content:`
        <h2>Chain of Custody</h2>
        <p>A <strong>chain of custody</strong> is an unbroken chronological record of who handled a piece of evidence and when. If the chain is broken, evidence can be challenged in court and thrown out.</p>
        ${cb('python','app/models/evidence.py','<span class="kw">from</span> sqlalchemy <span class="kw">import</span> ForeignKey, String, Text, LargeBinary\n<span class="kw">from</span> sqlalchemy.orm <span class="kw">import</span> Mapped, mapped_column, relationship\n<span class="kw">from</span> .base <span class="kw">import</span> Base, TimestampMixin\n\n<span class="kw">class</span> <span class="fn">Evidence</span>(Base, TimestampMixin):\n    __tablename__ = <span class="st">"evidence"</span>\n    id:          Mapped[<span class="fn">int</span>] = <span class="fn">mapped_column</span>(primary_key=<span class="kw">True</span>)\n    case_id:     Mapped[<span class="fn">int</span>] = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"cases.id"</span>))\n    label:       Mapped[<span class="fn">str</span>] = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">200</span>))\n    description: Mapped[<span class="fn">str</span>] = <span class="fn">mapped_column</span>(<span class="fn">Text</span>, nullable=<span class="kw">True</span>)\n    file_key:    Mapped[<span class="fn">str</span>] = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">500</span>), nullable=<span class="kw">True</span>)\n    sha256_hash: Mapped[<span class="fn">str</span>] = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">64</span>))  <span class="cm"># file integrity</span>\n    custody_log: Mapped[list[<span class="st">"CustodyEntry"</span>]] = <span class="fn">relationship</span>(back_populates=<span class="st">"evidence"</span>)\n\n<span class="kw">class</span> <span class="fn">CustodyEntry</span>(Base):\n    <span class="st">"""Immutable log of every evidence access/transfer."""</span>\n    __tablename__ = <span class="st">"custody_log"</span>\n    id:          Mapped[<span class="fn">int</span>]      = <span class="fn">mapped_column</span>(primary_key=<span class="kw">True</span>)\n    evidence_id: Mapped[<span class="fn">int</span>]      = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"evidence.id"</span>))\n    actor_id:    Mapped[<span class="fn">int</span>]      = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"users.id"</span>))\n    action:      Mapped[<span class="fn">str</span>]      = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">100</span>))  <span class="cm"># "uploaded","viewed","transferred"</span>\n    timestamp:   Mapped[<span class="fn">datetime</span>] = <span class="fn">mapped_column</span>(server_default=<span class="fn">func.now</span>())\n    notes:       Mapped[<span class="fn">str</span>]      = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">500</span>), nullable=<span class="kw">True</span>)\n    evidence:    Mapped[<span class="st">"Evidence"</span>] = <span class="fn">relationship</span>(back_populates=<span class="st">"custody_log"</span>)')}
        <h2>File Integrity with SHA-256</h2>
        ${cb('python','app/services/evidence.py','<span class="kw">import</span> hashlib\n\n<span class="kw">def</span> <span class="fn">compute_sha256</span>(data: <span class="fn">bytes</span>) -> <span class="fn">str</span>:\n    <span class="st">"""Compute SHA-256 hash of file bytes for integrity verification."""</span>\n    <span class="kw">return</span> hashlib.<span class="fn">sha256</span>(data).<span class="fn">hexdigest</span>()\n\n<span class="kw">def</span> <span class="fn">verify_integrity</span>(data: <span class="fn">bytes</span>, stored_hash: <span class="fn">str</span>) -> <span class="fn">bool</span>:\n    <span class="st">"""Verify a file has not been tampered with since upload."""</span>\n    <span class="kw">return</span> <span class="fn">compute_sha256</span>(data) == stored_hash\n\n<span class="cm"># When uploading evidence:</span>\n<span class="cm"># sha256 = compute_sha256(file_bytes)</span>\n<span class="cm"># evidence = Evidence(..., sha256_hash=sha256)</span>\n\n<span class="cm"># When downloading evidence:</span>\n<span class="cm"># if not verify_integrity(file_bytes, evidence.sha256_hash):</span>\n<span class="cm">#     raise HTTPException(500, "File integrity check failed")</span>')}
        ${quiz(
          'Why do we store a SHA-256 hash of each evidence file?',
          ['To compress the file','To detect if the file has been tampered with or corrupted since upload','To encrypt the file','To generate a unique filename'],
          1,
          'SHA-256 is a cryptographic hash. If even one byte of the file changes, the hash changes completely. By storing the hash at upload time and recomputing it on download, we can prove the file is identical to what was originally submitted.'
        )}
      `
    }
  ]
},

// ─────────────────────────────────────────────────────────────
// MODULE 11 — Financials & Fees
// ─────────────────────────────────────────────────────────────
{
  id:'m11', num:'11', title:'Financials & Court Fees',
  lessons:[
    {
      id:'l01', title:'Fee Schedules & Payment Records',
      duration:'25 min',
      intro:'Courts charge fees for filings, hearings, and services. Building a financial module requires careful data modeling — money is unforgiving of bugs.',
      builds:'Fee model, payment records, outstanding balance endpoint',
      content:`
        <h2>Money in Databases</h2>
        ${callout('warn','Never use float for money','<code>float</code> has rounding errors. <code>0.1 + 0.2 = 0.30000000000000004</code> in Python. Store money as integer cents or use PostgreSQL\'s <code>NUMERIC</code> type with Python\'s <code>Decimal</code>.')}
        ${cb('python','app/models/finance.py','<span class="kw">from</span> sqlalchemy <span class="kw">import</span> ForeignKey, Numeric, String, Boolean\n<span class="kw">from</span> sqlalchemy.orm <span class="kw">import</span> Mapped, mapped_column\n<span class="kw">from</span> decimal <span class="kw">import</span> Decimal\n<span class="kw">from</span> .base <span class="kw">import</span> Base, TimestampMixin\n\n<span class="kw">class</span> <span class="fn">FeeSchedule</span>(Base):\n    <span class="st">"""Defines the fee for each type of court action."""</span>\n    __tablename__ = <span class="st">"fee_schedules"</span>\n    id:          Mapped[<span class="fn">int</span>]     = <span class="fn">mapped_column</span>(primary_key=<span class="kw">True</span>)\n    action_type: Mapped[<span class="fn">str</span>]     = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">100</span>), unique=<span class="kw">True</span>)\n    amount:      Mapped[<span class="fn">Decimal</span>] = <span class="fn">mapped_column</span>(<span class="fn">Numeric</span>(<span class="num">10</span>, <span class="num">2</span>))\n    is_active:   Mapped[<span class="fn">bool</span>]    = <span class="fn">mapped_column</span>(<span class="fn">Boolean</span>, default=<span class="kw">True</span>)\n\n<span class="kw">class</span> <span class="fn">PaymentRecord</span>(Base, TimestampMixin):\n    <span class="st">"""Records a payment against a case fee."""</span>\n    __tablename__ = <span class="st">"payments"</span>\n    id:         Mapped[<span class="fn">int</span>]     = <span class="fn">mapped_column</span>(primary_key=<span class="kw">True</span>)\n    case_id:    Mapped[<span class="fn">int</span>]     = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"cases.id"</span>))\n    amount:     Mapped[<span class="fn">Decimal</span>] = <span class="fn">mapped_column</span>(<span class="fn">Numeric</span>(<span class="num">10</span>, <span class="num">2</span>))\n    method:     Mapped[<span class="fn">str</span>]     = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">50</span>))  <span class="cm"># "cash","card","bank"</span>\n    reference:  Mapped[<span class="fn">str</span>]     = <span class="fn">mapped_column</span>(<span class="fn">String</span>(<span class="num">200</span>), nullable=<span class="kw">True</span>)\n    confirmed:  Mapped[<span class="fn">bool</span>]    = <span class="fn">mapped_column</span>(<span class="fn">Boolean</span>, default=<span class="kw">False</span>)')}
        ${quiz(
          'Why should monetary values be stored as NUMERIC/Decimal rather than float?',
          ['Decimal is faster to query','Float has inherent binary rounding errors that cause cent-level inaccuracies in financial calculations','Decimal takes less storage space','Float values cannot be sorted in SQL'],
          1,
          'Floating-point numbers (float/double) cannot exactly represent most decimal fractions. Over many calculations, rounding errors accumulate. Python\'s <code>Decimal</code> and SQL\'s <code>NUMERIC</code> use exact decimal arithmetic — essential for money.'
        )}
      `
    }
  ]
},


// ─────────────────────────────────────────────────────────────
// MODULE 12 — Analytics Dashboard
// ─────────────────────────────────────────────────────────────
{
  id:'m12', num:'12', title:'Analytics Dashboard',
  lessons:[
    {
      id:'l01', title:'Aggregation Queries & Chart.js',
      duration:'30 min',
      intro:'Judges, court administrators, and the public need to see trends. Build a real-time analytics API and render it with Chart.js on the frontend.',
      builds:'Analytics router with aggregation endpoints + Chart.js frontend',
      content:`
        <h2>SQL Aggregations</h2>
        <p>PostgreSQL's aggregation functions (<code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>GROUP BY</code>) turn raw rows into summary statistics.</p>
        ${cb('python','app/routers/analytics.py','<span class="kw">from</span> sqlalchemy <span class="kw">import</span> func, extract, select\n<span class="kw">from</span> fastapi <span class="kw">import</span> APIRouter, Depends\n<span class="kw">from</span> app.models.case <span class="kw">import</span> Case, CaseStatus\n\nrouter = <span class="fn">APIRouter</span>(prefix=<span class="st">"/analytics"</span>, tags=[<span class="st">"Analytics"</span>])\n\n<span class="dec">@router.get</span>(<span class="st">"/case-stats"</span>)\n<span class="kw">async def</span> <span class="fn">case_stats</span>(db: AsyncSession = <span class="fn">Depends</span>(get_db)):\n    <span class="cm"># Cases per status</span>\n    by_status = <span class="kw">await</span> db.<span class="fn">execute</span>(\n        <span class="fn">select</span>(Case.status, <span class="fn">func.count</span>(Case.id).label(<span class="st">"count"</span>))\n        .<span class="fn">group_by</span>(Case.status)\n    )\n\n    <span class="cm"># Cases filed per month (last 12 months)</span>\n    by_month = <span class="kw">await</span> db.<span class="fn">execute</span>(\n        <span class="fn">select</span>(\n            <span class="fn">extract</span>(<span class="st">"year"</span>,  Case.created_at).label(<span class="st">"year"</span>),\n            <span class="fn">extract</span>(<span class="st">"month"</span>, Case.created_at).label(<span class="st">"month"</span>),\n            <span class="fn">func.count</span>(Case.id).label(<span class="st">"count"</span>)\n        ).<span class="fn">group_by</span>(<span class="st">"year"</span>, <span class="st">"month"</span>)\n         .<span class="fn">order_by</span>(<span class="st">"year"</span>, <span class="st">"month"</span>)\n    )\n\n    <span class="kw">return</span> {\n        <span class="st">"by_status"</span>: [{<span class="st">"status"</span>: r.status.value, <span class="st">"count"</span>: r.count} <span class="kw">for</span> r <span class="kw">in</span> by_status],\n        <span class="st">"by_month"</span>:  [{<span class="st">"year"</span>: r.year, <span class="st">"month"</span>: r.month, <span class="st">"count"</span>: r.count} <span class="kw">for</span> r <span class="kw">in</span> by_month],\n    }')}
        <h2>Frontend Chart.js Integration</h2>
        ${cb('javascript','dashboard.js','<span class="cm">// Fetch analytics data and render a bar chart</span>\n<span class="kw">async function</span> <span class="fn">loadCaseChart</span>() {\n    <span class="kw">const</span> data = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="st">"/api/v1/analytics/case-stats"</span>, {\n        headers: { Authorization: <span class="st">\`Bearer \${token}\`</span> }\n    }).<span class="fn">then</span>(r => r.<span class="fn">json</span>());\n\n    <span class="kw">const</span> labels = data.by_status.<span class="fn">map</span>(s => s.status);\n    <span class="kw">const</span> values = data.by_status.<span class="fn">map</span>(s => s.count);\n\n    <span class="kw">new</span> <span class="fn">Chart</span>(<span class="fn">document.getElementById</span>(<span class="st">"caseChart"</span>), {\n        type: <span class="st">"bar"</span>,\n        data: {\n            labels,\n            datasets: [{\n                label: <span class="st">"Cases by Status"</span>,\n                data: values,\n                backgroundColor: [<span class="st">"#2e7dc4"</span>, <span class="st">"#28a745"</span>, <span class="st">"#c9a227"</span>, <span class="st">"#dc3545"</span>]\n            }]\n        },\n        options: { responsive: <span class="kw">true</span>, plugins: { legend: { position: <span class="st">"top"</span> } } }\n    });\n}')}
        ${quiz(
          'What SQL clause groups rows and applies aggregate functions to each group?',
          ['ORDER BY','HAVING','GROUP BY','DISTINCT'],
          2,
          '<strong>GROUP BY</strong> collects rows with the same value into a group, then applies aggregate functions (COUNT, SUM, AVG) to each group. <code>HAVING</code> filters the groups after aggregation (like WHERE but for grouped results).'
        )}
      `
    }
  ]
},

// ─────────────────────────────────────────────────────────────
// MODULE 13 — Public Portal
// ─────────────────────────────────────────────────────────────
{
  id:'m13', num:'13', title:'Public Portal',
  lessons:[
    {
      id:'l01', title:'Read-Only Public API & Rate Limiting',
      duration:'20 min',
      intro:'Citizens have a right to access public court records. Build a secure, read-only portal with privacy redactions and rate limiting to prevent abuse.',
      builds:'Public router with redactions and Redis-backed rate limiter',
      content:`
        <h2>What to Show the Public</h2>
        <p>Not all case data is public. Home addresses, victim details, and sealed records must be redacted. We build a separate schema layer for public responses.</p>
        ${cb('python','app/schemas/public.py','<span class="kw">class</span> <span class="fn">PublicCaseResponse</span>(BaseModel):\n    <span class="st">"""Public-facing case data — personally identifiable info removed."""</span>\n    case_number: <span class="fn">str</span>\n    title:       <span class="fn">str</span>\n    status:      <span class="fn">str</span>\n    case_type:   <span class="fn">str</span>\n    filed_year:  <span class="fn">int</span>\n    <span class="cm"># NOTE: no party names, no addresses, no documents</span>')}
        <h2>Rate Limiting with Redis</h2>
        ${cb('python','app/core/rate_limit.py','<span class="kw">import</span> redis.asyncio <span class="kw">as</span> aioredis\n<span class="kw">from</span> fastapi <span class="kw">import</span> Request, HTTPException\n\nredis_client = <span class="kw">None</span>  <span class="cm"># initialised on startup</span>\n\n<span class="kw">async def</span> <span class="fn">rate_limit</span>(request: Request, max_requests: <span class="fn">int</span> = <span class="num">30</span>, window: <span class="fn">int</span> = <span class="num">60</span>):\n    <span class="st">"""Allow max_requests per window seconds per IP."""</span>\n    ip  = request.client.host\n    key = <span class="st">f"rl:{ip}"</span>\n    count = <span class="kw">await</span> redis_client.<span class="fn">incr</span>(key)\n    <span class="kw">if</span> count == <span class="num">1</span>:\n        <span class="kw">await</span> redis_client.<span class="fn">expire</span>(key, window)  <span class="cm"># set TTL on first request</span>\n    <span class="kw">if</span> count > max_requests:\n        <span class="kw">raise</span> <span class="fn">HTTPException</span>(\n            status_code=<span class="num">429</span>,\n            detail=<span class="st">f"Too many requests. Try again in {window} seconds."</span>\n        )')}
        ${quiz(
          'Why do public endpoints need rate limiting?',
          ['To speed up responses','To prevent abuse — automated scrapers or DoS attacks that overwhelm the server','To enforce authentication','To compress response payloads'],
          1,
          'Rate limiting caps the number of requests a single client can make in a time window. Without it, a single bot could issue thousands of requests per second, consuming all server resources and denying service to legitimate users.'
        )}
      `
    }
  ]
},


// ─────────────────────────────────────────────────────────────
// MODULE 14 — Warrants & Jury Management
// ─────────────────────────────────────────────────────────────
{
  id:'m14', num:'14', title:'Warrants & Jury Management',
  lessons:[
    {
      id:'l01', title:'Warrant Workflow',
      duration:'25 min',
      intro:'Warrants are sensitive, judge-issued legal instruments. They require strict role-based access, audit trails, and status workflows.',
      builds:'Warrant model with judge-only issuance + status workflow',
      content:`
        <h2>Warrant Types & Lifecycle</h2>
        ${cb('python','app/models/warrant.py','<span class="kw">from</span> enum <span class="kw">import</span> Enum\n\n<span class="kw">class</span> <span class="fn">WarrantType</span>(str, Enum):\n    ARREST = <span class="st">"arrest"</span>\n    SEARCH = <span class="st">"search"</span>\n    BENCH  = <span class="st">"bench"</span>   <span class="cm"># judge issues for non-compliance</span>\n\n<span class="kw">class</span> <span class="fn">WarrantStatus</span>(str, Enum):\n    REQUESTED = <span class="st">"requested"</span>  <span class="cm"># clerk submits request</span>\n    ISSUED    = <span class="st">"issued"</span>     <span class="cm"># judge approves</span>\n    EXECUTED  = <span class="st">"executed"</span>   <span class="cm"># law enforcement serves it</span>\n    QUASHED   = <span class="st">"quashed"</span>    <span class="cm"># cancelled by judge</span>\n    EXPIRED   = <span class="st">"expired"</span>    <span class="cm"># time-limited warrant expired</span>\n\n<span class="kw">class</span> <span class="fn">Warrant</span>(Base, TimestampMixin):\n    __tablename__ = <span class="st">"warrants"</span>\n    id:         Mapped[<span class="fn">int</span>]          = <span class="fn">mapped_column</span>(primary_key=<span class="kw">True</span>)\n    case_id:    Mapped[<span class="fn">int</span>]          = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"cases.id"</span>))\n    party_id:   Mapped[<span class="fn">int</span>]          = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"parties.id"</span>))\n    wtype:      Mapped[WarrantType]    = <span class="fn">mapped_column</span>(<span class="fn">SAEnum</span>(WarrantType))\n    status:     Mapped[WarrantStatus]  = <span class="fn">mapped_column</span>(<span class="fn">SAEnum</span>(WarrantStatus), default=WarrantStatus.REQUESTED)\n    issued_by:  Mapped[Optional[<span class="fn">int</span>]] = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"users.id"</span>), nullable=<span class="kw">True</span>)\n    expires_at: Mapped[Optional[<span class="fn">datetime</span>]] = <span class="fn">mapped_column</span>(nullable=<span class="kw">True</span>)')}
        ${cb('python','app/routers/warrants.py','<span class="dec">@router.post</span>(<span class="st">"/{warrant_id}/issue"</span>)\n<span class="kw">async def</span> <span class="fn">issue_warrant</span>(\n    warrant_id: <span class="fn">int</span>,\n    user       = <span class="fn">Depends</span>(<span class="fn">require_role</span>(<span class="st">"judge"</span>, <span class="st">"admin"</span>)),\n    db: AsyncSession = <span class="fn">Depends</span>(get_db)\n):\n    warrant = <span class="kw">await</span> <span class="fn">get_warrant</span>(db, warrant_id)\n    <span class="kw">if</span> warrant.status != WarrantStatus.REQUESTED:\n        <span class="kw">raise</span> <span class="fn">HTTPException</span>(<span class="num">400</span>, <span class="st">"Only requested warrants can be issued"</span>)\n    warrant.status    = WarrantStatus.ISSUED\n    warrant.issued_by = user.id\n    <span class="kw">await</span> <span class="fn">log_warrant_action</span>(db, warrant_id, user.id, <span class="st">"issued"</span>)\n    <span class="kw">return</span> warrant')}
        ${quiz(
          'Which HTTP status should be returned when a clerk tries to issue a warrant (judge-only action)?',
          ['401 Unauthorized','404 Not Found','403 Forbidden','400 Bad Request'],
          2,
          '<strong>403 Forbidden</strong>: the clerk IS authenticated (not 401), but their role doesn\'t have permission to perform this action. 401 would mean they are not logged in at all.'
        )}
      `
    },
    {
      id:'l02', title:'Jury Pool Management',
      duration:'20 min',
      intro:'Track jury eligibility, random selection, and summons generation — a complete jury management workflow.',
      builds:'Jury pool model + random selection endpoint + summons PDF',
      content:`
        <h2>Jury Selection</h2>
        ${cb('python','app/models/jury.py','<span class="kw">class</span> <span class="fn">JurorStatus</span>(str, Enum):\n    ELIGIBLE    = <span class="st">"eligible"</span>\n    SUMMONED    = <span class="st">"summoned"</span>\n    EXCUSED     = <span class="st">"excused"</span>\n    SEATED      = <span class="st">"seated"</span>\n    DISMISSED   = <span class="st">"dismissed"</span>\n\n<span class="kw">class</span> <span class="fn">JurorPool</span>(Base, TimestampMixin):\n    __tablename__ = <span class="st">"juror_pool"</span>\n    id:        Mapped[<span class="fn">int</span>]         = <span class="fn">mapped_column</span>(primary_key=<span class="kw">True</span>)\n    case_id:   Mapped[<span class="fn">int</span>]         = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"cases.id"</span>))\n    party_id:  Mapped[<span class="fn">int</span>]         = <span class="fn">mapped_column</span>(<span class="fn">ForeignKey</span>(<span class="st">"parties.id"</span>))\n    status:    Mapped[JurorStatus]   = <span class="fn">mapped_column</span>(default=JurorStatus.ELIGIBLE)')}
        ${cb('python','app/crud/jury.py','<span class="kw">import</span> random\n\n<span class="kw">async def</span> <span class="fn">select_jury_pool</span>(\n    db: AsyncSession, case_id: <span class="fn">int</span>, count: <span class="fn">int</span> = <span class="num">12</span>\n) -> list[JurorPool]:\n    <span class="st">"""Randomly select `count` eligible citizens for jury duty."""</span>\n    eligible = <span class="kw">await</span> db.<span class="fn">execute</span>(\n        <span class="fn">select</span>(Party)\n        .<span class="fn">where</span>(Party.is_eligible_juror == <span class="kw">True</span>)\n        .<span class="fn">order_by</span>(<span class="fn">func.random</span>())  <span class="cm"># PostgreSQL random sort</span>\n        .<span class="fn">limit</span>(count)\n    )\n    pool_entries = []\n    <span class="kw">for</span> citizen <span class="kw">in</span> eligible.<span class="fn">scalars</span>():\n        entry = <span class="fn">JurorPool</span>(case_id=case_id, party_id=citizen.id)\n        db.<span class="fn">add</span>(entry)\n        pool_entries.<span class="fn">append</span>(entry)\n    <span class="kw">return</span> pool_entries')}
        ${quiz(
          'How do we implement random juror selection in PostgreSQL?',
          ['ORDER BY RAND()','ORDER BY RANDOM()','SAMPLE(n)','RANDOM ORDER'],
          1,
          'PostgreSQL uses <code>ORDER BY RANDOM()</code> (not <code>RAND()</code>, which is MySQL). Combined with <code>LIMIT n</code>, this efficiently selects n random rows from a table.'
        )}
      `
    }
  ]
},


// ─────────────────────────────────────────────────────────────
// MODULE 15 — Docker, Nginx & SSL
// ─────────────────────────────────────────────────────────────
{
  id:'m15', num:'15', title:'Docker, Nginx & SSL',
  lessons:[
    {
      id:'l01', title:'Multi-Container Docker Compose',
      duration:'35 min',
      intro:'Bundle every service — FastAPI, PostgreSQL, Redis, Celery, Nginx — into a single docker-compose.yml and deploy JusticeCMS with one command.',
      builds:'Production docker-compose.yml with all services wired up',
      content:`
        <h2>The Full Stack in Containers</h2>
        <p>Docker Compose lets you define and run multi-container applications. Our stack has six services, each in its own container, communicating over a private Docker network.</p>
        ${cb('yaml','docker-compose.yml','<span class="kw">version</span>: <span class="st">"3.9"</span>\n\n<span class="kw">services</span>:\n\n  <span class="cm"># ── Reverse Proxy ──</span>\n  <span class="fn">nginx</span>:\n    image: nginx:alpine\n    <span class="kw">ports</span>: [<span class="st">"80:80"</span>, <span class="st">"443:443"</span>]\n    <span class="kw">volumes</span>:\n      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro\n      - ./nginx/certs:/etc/nginx/certs:ro\n    <span class="kw">depends_on</span>: [api]\n\n  <span class="cm"># ── FastAPI App ──</span>\n  <span class="fn">api</span>:\n    build: .\n    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4\n    <span class="kw">env_file</span>: .env\n    <span class="kw">depends_on</span>: [postgres, redis]\n    <span class="kw">deploy</span>:\n      replicas: <span class="num">2</span>  <span class="cm"># two app instances behind nginx</span>\n\n  <span class="cm"># ── Database ──</span>\n  <span class="fn">postgres</span>:\n    image: postgres:16-alpine\n    <span class="kw">env_file</span>: .env\n    <span class="kw">volumes</span>:\n      - postgres_data:/var/lib/postgresql/data\n    <span class="kw">healthcheck</span>:\n      test: [<span class="st">"CMD-SHELL"</span>, <span class="st">"pg_isready -U $$POSTGRES_USER"</span>]\n      interval: 10s\n      retries: 5\n\n  <span class="cm"># ── Redis ──</span>\n  <span class="fn">redis</span>:\n    image: redis:7-alpine\n    command: redis-server --requirepass <span class="st">"$$REDIS_PASSWORD"</span>\n    <span class="kw">volumes</span>:\n      - redis_data:/data\n\n  <span class="cm"># ── Celery Worker ──</span>\n  <span class="fn">worker</span>:\n    build: .\n    command: celery -A app.worker worker -l info -c 4\n    <span class="kw">env_file</span>: .env\n    <span class="kw">depends_on</span>: [redis, postgres]\n\n  <span class="cm"># ── Celery Beat (scheduler) ──</span>\n  <span class="fn">beat</span>:\n    build: .\n    command: celery -A app.worker beat -l info\n    <span class="kw">env_file</span>: .env\n    <span class="kw">depends_on</span>: [redis]\n\n<span class="kw">volumes</span>:\n  postgres_data:\n  redis_data:')}
        ${callout('key','Health Checks','Always add health checks to stateful containers like PostgreSQL. Docker will wait until PostgreSQL is truly ready before starting the API service that depends on it.')}
        <h2>The Dockerfile</h2>
        ${cb('dockerfile','Dockerfile','<span class="cm"># Multi-stage build: smaller final image</span>\n<span class="kw">FROM</span> python:3.12-slim <span class="kw">AS</span> base\n<span class="kw">WORKDIR</span> /app\n\n<span class="cm"># Install deps first (Docker layer caching)</span>\n<span class="kw">COPY</span> requirements.txt .\n<span class="kw">RUN</span> pip install --no-cache-dir -r requirements.txt\n\n<span class="cm"># Copy application code</span>\n<span class="kw">COPY</span> app/ ./app/\n<span class="kw">COPY</span> alembic/ ./alembic/\n<span class="kw">COPY</span> alembic.ini .\n\n<span class="cm"># Non-root user for security</span>\n<span class="kw">RUN</span> adduser --disabled-password --gecos "" appuser\n<span class="kw">USER</span> appuser\n\n<span class="kw">EXPOSE</span> 8000')}
        ${quiz(
          'Why copy requirements.txt before copying application code in a Dockerfile?',
          ['requirements.txt must be installed before code runs','Docker caches each layer. If only code changes, Docker reuses the cached dependency layer — making rebuilds much faster','It is just a convention, no real benefit','requirements.txt is smaller, so it copies faster'],
          1,
          'Docker builds images layer by layer. Each <code>RUN</code>/<code>COPY</code> creates a cached layer. By copying and installing <code>requirements.txt</code> first (a rarely changing file), Docker reuses that expensive installation layer on every rebuild unless requirements actually change.'
        )}
      `
    },
    {
      id:'l02', title:'Nginx Reverse Proxy & HTTPS',
      duration:'30 min',
      intro:'Nginx sits in front of FastAPI — handling SSL termination, load balancing, static files, and security headers.',
      builds:'nginx.conf with HTTPS, security headers, and upstream to FastAPI',
      content:`
        <h2>Why a Reverse Proxy?</h2>
        <p>Nginx handles things FastAPI shouldn't have to: TLS termination, serving static files, connection rate limiting, and load balancing across multiple app instances. FastAPI only sees decrypted HTTP internally.</p>
        ${cb('nginx','nginx/nginx.conf','<span class="kw">upstream</span> api {\n    <span class="fn">server</span> api:8000;  <span class="cm"># Docker service name</span>\n}\n\n<span class="kw">server</span> {\n    <span class="fn">listen</span> 80;\n    <span class="fn">server_name</span> justicecms.example.com;\n    <span class="cm"># Redirect all HTTP to HTTPS</span>\n    <span class="fn">return</span> 301 https://$host$request_uri;\n}\n\n<span class="kw">server</span> {\n    <span class="fn">listen</span> 443 ssl http2;\n    <span class="fn">server_name</span> justicecms.example.com;\n\n    <span class="fn">ssl_certificate</span>     /etc/nginx/certs/fullchain.pem;\n    <span class="fn">ssl_certificate_key</span> /etc/nginx/certs/privkey.pem;\n    <span class="fn">ssl_protocols</span>       TLSv1.2 TLSv1.3;\n    <span class="fn">ssl_ciphers</span>         HIGH:!aNULL:!MD5;\n\n    <span class="cm"># Security headers</span>\n    <span class="fn">add_header</span> X-Frame-Options DENY;\n    <span class="fn">add_header</span> X-Content-Type-Options nosniff;\n    <span class="fn">add_header</span> Strict-Transport-Security <span class="st">"max-age=63072000"</span>;\n\n    <span class="cm"># Proxy to FastAPI</span>\n    <span class="kw">location</span> /api/ {\n        <span class="fn">proxy_pass</span>       http://api;\n        <span class="fn">proxy_set_header</span> Host $host;\n        <span class="fn">proxy_set_header</span> X-Real-IP $remote_addr;\n        <span class="fn">proxy_set_header</span> X-Forwarded-Proto https;\n    }\n\n    <span class="cm"># Serve frontend static files directly</span>\n    <span class="kw">location</span> / {\n        <span class="fn">root</span>  /var/www/html;\n        <span class="fn">index</span> index.html;\n        <span class="fn">try_files</span> $uri $uri/ /index.html;  <span class="cm"># SPA fallback</span>\n    }\n}')}
        <h2>Getting a Free SSL Certificate</h2>
        ${cb('bash','','<span class="cm"># Install Certbot (Let\'s Encrypt client)</span>\n<span class="fn">sudo</span> apt install certbot python3-certbot-nginx\n\n<span class="cm"># Obtain certificate (auto-configures Nginx)</span>\n<span class="fn">sudo</span> certbot --nginx -d justicecms.example.com\n\n<span class="cm"># Certificates auto-renew every 90 days via a cron job</span>\n<span class="cm"># Test renewal:</span>\n<span class="fn">sudo</span> certbot renew --dry-run')}
        ${quiz(
          'What is SSL/TLS termination in the context of Nginx?',
          ['Nginx permanently disables SSL for performance','Nginx decrypts HTTPS traffic and forwards plain HTTP to the backend','Nginx re-encrypts traffic between itself and PostgreSQL','Nginx blocks all non-SSL connections'],
          1,
          'SSL termination means Nginx handles the encrypted HTTPS connection from the browser, decrypts it, and forwards plain HTTP internally to FastAPI. This simplifies the app (no SSL code), reduces CPU load on the app servers, and centralises certificate management.'
        )}
      `
    }
  ]
},


// ─────────────────────────────────────────────────────────────
// MODULE 16 — Monitoring & Backups
// ─────────────────────────────────────────────────────────────
{
  id:'m16', num:'16', title:'Monitoring, Logging & Backups',
  lessons:[
    {
      id:'l01', title:'Prometheus & Grafana',
      duration:'30 min',
      intro:'A production system you cannot observe is a system you cannot trust. Instrument JusticeCMS with Prometheus metrics and build a Grafana dashboard.',
      builds:'Prometheus endpoint in FastAPI + Grafana dashboard config',
      content:`
        <h2>What to Monitor</h2>
        <p>At minimum, every production web service should expose: request rate, error rate, and latency (the RED method). For databases: connection pool size, query duration, and slow query count.</p>
        ${cb('python','app/core/metrics.py','<span class="kw">from</span> prometheus_client <span class="kw">import</span> Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST\n<span class="kw">from</span> fastapi <span class="kw">import</span> Request, Response\n<span class="kw">import</span> time\n\n<span class="cm"># Define metrics</span>\nREQUEST_COUNT = <span class="fn">Counter</span>(\n    <span class="st">"http_requests_total"</span>,\n    <span class="st">"Total HTTP requests"</span>,\n    [<span class="st">"method"</span>, <span class="st">"endpoint"</span>, <span class="st">"status"</span>]\n)\nREQUEST_LATENCY = <span class="fn">Histogram</span>(\n    <span class="st">"http_request_duration_seconds"</span>,\n    <span class="st">"Request latency"</span>,\n    [<span class="st">"method"</span>, <span class="st">"endpoint"</span>]\n)\n\n<span class="kw">async def</span> <span class="fn">metrics_middleware</span>(request: Request, call_next):\n    start = time.<span class="fn">time</span>()\n    response = <span class="kw">await</span> <span class="fn">call_next</span>(request)\n    duration = time.<span class="fn">time</span>() - start\n    REQUEST_COUNT.<span class="fn">labels</span>(\n        request.method, request.url.path, response.status_code\n    ).<span class="fn">inc</span>()\n    REQUEST_LATENCY.<span class="fn">labels</span>(request.method, request.url.path).<span class="fn">observe</span>(duration)\n    <span class="kw">return</span> response\n\n<span class="dec">@app.get</span>(<span class="st">"/metrics"</span>)  <span class="cm"># Prometheus scrape endpoint</span>\n<span class="kw">async def</span> <span class="fn">metrics</span>():\n    <span class="kw">return</span> <span class="fn">Response</span>(<span class="fn">generate_latest</span>(), media_type=CONTENT_TYPE_LATEST)')}
        <h2>Grafana Dashboard</h2>
        ${cb('yaml','docker-compose.yml (additions)','<span class="fn">prometheus</span>:\n  image: prom/prometheus\n  <span class="kw">volumes</span>:\n    - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml\n  <span class="kw">ports</span>: [<span class="st">"9090:9090"</span>]\n\n<span class="fn">grafana</span>:\n  image: grafana/grafana\n  <span class="kw">ports</span>: [<span class="st">"3000:3000"</span>]\n  <span class="kw">environment</span>:\n    GF_SECURITY_ADMIN_PASSWORD: <span class="st">"${GRAFANA_PASSWORD}"</span>')}
        ${quiz(
          'What is the RED method in API monitoring?',
          ['Redundancy, Elasticity, Durability','Rate, Errors, Duration','Requests, Errors, Database','Reliability, Efficiency, Deployability'],
          1,
          'The <strong>RED method</strong> is a monitoring framework: <strong>R</strong>ate (requests per second), <strong>E</strong>rrors (failed requests per second), <strong>D</strong>uration (distribution of request latency). These three metrics give a complete health picture of any request-driven service.'
        )}
      `
    },
    {
      id:'l02', title:'Automated Database Backups',
      duration:'20 min',
      intro:'Data loss is catastrophic for a court system. Automate daily backups, test restores, and send alerts if a backup fails.',
      builds:'Backup shell script + cron job + backup verification',
      content:`
        <h2>pg_dump — PostgreSQL Backup Tool</h2>
        ${cb('bash','scripts/backup.sh','<span class="cm">#!/bin/bash</span>\n<span class="cm"># Daily backup script — run via cron</span>\n\nSET -euo pipefail  <span class="cm"># exit on error, unset var, or pipe failure</span>\n\nBACKUP_DIR=/var/backups/justice_cms\nDATE=$(<span class="fn">date</span> +%Y%m%d_%H%M%S)\nFILE=${BACKUP_DIR}/backup_${DATE}.sql.gz\n\n<span class="cm"># Create backup directory if it doesn\'t exist</span>\n<span class="fn">mkdir</span> -p ${BACKUP_DIR}\n\n<span class="cm"># Run pg_dump from inside the postgres container</span>\n<span class="fn">docker-compose</span> exec -T postgres pg_dump \\\n    -U ${POSTGRES_USER} \\\n    ${POSTGRES_DB} | <span class="fn">gzip</span> > ${FILE}\n\n<span class="cm"># Verify backup was created and is not empty</span>\n<span class="kw">if</span> [ ! -s ${FILE} ]; <span class="kw">then</span>\n    <span class="fn">echo</span> <span class="st">"ERROR: Backup file is empty!"</span> >&2\n    <span class="cm"># Send alert (email/Slack)</span>\n    <span class="fn">curl</span> -s -X POST ${SLACK_WEBHOOK} \\\n        -d <span class="st">\'{"text":"🚨 JusticeCMS backup FAILED: \'</span>${DATE}<span class="st">\'"}\'</span>\n    <span class="fn">exit</span> 1\n<span class="kw">fi</span>\n\n<span class="fn">echo</span> <span class="st">"Backup successful: ${FILE} ($(du -sh ${FILE} | cut -f1))"</span>\n\n<span class="cm"># Delete backups older than 30 days</span>\n<span class="fn">find</span> ${BACKUP_DIR} -name <span class="st">"backup_*.sql.gz"</span> -mtime +30 -delete')}
        <h2>Schedule with Cron</h2>
        ${cb('bash','','<span class="cm"># Edit the cron table</span>\n<span class="fn">crontab</span> -e\n\n<span class="cm"># Add this line (runs at 2am every day):</span>\n<span class="cm"># 0 2 * * * /opt/justice_cms/scripts/backup.sh >> /var/log/backup.log 2>&1</span>\n\n<span class="cm"># Test restore:</span>\n<span class="fn">gunzip</span> -c backup_20240101.sql.gz | <span class="fn">docker-compose</span> exec -T postgres \\\n    psql -U ${POSTGRES_USER} ${POSTGRES_DB}')}
        ${callout('warn','Test Your Restores','A backup you have never tested is not a backup — it\'s a hope. Schedule monthly restore tests to a separate database to confirm your backups are actually valid.')}
        ${quiz(
          'What does "set -euo pipefail" do at the top of a bash script?',
          ['Sets the script to run silently without output','Makes the script exit immediately on any error, undefined variable, or failed pipe command','Enables debugging mode','Sets the default shell to bash'],
          1,
          '<code>-e</code>: exit on error. <code>-u</code>: treat unset variables as errors. <code>-o pipefail</code>: a pipeline fails if any command in it fails. Together they prevent silent failures — a backup script must not silently continue after an error.'
        )}
        ${exercise('Complete Deployment',`<p>You\'ve built the entire JusticeCMS stack! For the final exercise:</p><ul><li>Clone your repo to a fresh Ubuntu VM (or use a cloud provider trial)</li><li>Install Docker and Docker Compose</li><li>Copy your <code>.env</code> file and run <code>docker-compose up -d</code></li><li>Run <code>docker-compose exec api alembic upgrade head</code></li><li>Visit <code>http://your-server-ip/docs</code></li><li>Configure Certbot for HTTPS</li><li>Set up the backup cron job and verify it runs</li></ul><p>🎉 Congratulations — JusticeCMS is live!</p>`)}
      `
    }
  ]
},

  ]  // end modules array
};   // end COURSE_DATA

