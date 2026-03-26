import { useState, useRef, useEffect, useCallback } from 'react';
import { projects, skills } from '../../data/projects';
import './Apps.css';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'ascii';
  content: string;
}

const ASCII_ART = `
   _____                .__  __           _________.__       .__
  /  _  \\   ____________|__|/  |_        /   _____/|__| ____ |  |__ _____
 /  /_\\  \\ /     \\_  __ \\  \\   __\\       \\_____  \\ |  |/    \\|  |  \\\\__  \\
/    |    \\  Y Y  \\  | \\/  ||  |         /        \\|  |   |  \\   Y  \\/ __ \\_
\\____|__  /__|_|  /__|  |__||__|        /_______  /|__|___|  /___|  (____  /
        \\/      \\/                              \\/         \\/     \\/     \\/
`;

const HELP_TEXT = `Available commands:

  about          — Who I am
  skills         — Technical skills
  projects       — List all projects
  project <name> — View project details
  experience     — Work history
  contact        — How to reach me
  mcp status     — Check MCP CI/CD server status
  mcp pipelines  — List CI/CD pipelines
  mcp deploy     — Trigger deployment (simulated)
  neofetch       — System info
  clear          — Clear terminal
  help           — Show this message
  echo <text>    — Echo text back
  whoami         — Current user
  date           — Current date/time
  uname          — System info
  pwd            — Working directory
  ls             — List directory contents
`;

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'ascii', content: ASCII_ART },
    { type: 'success', content: 'Welcome to Amrit\'s Portfolio Terminal v1.0.0' },
    { type: 'output', content: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    addLines([{ type: 'input', content: `amrit@portfolio ~ % ${cmd}` }]);

    switch (command) {
      case '':
        break;

      case 'help':
        addLines([{ type: 'output', content: HELP_TEXT }]);
        break;

      case 'clear':
        setLines([]);
        break;

      case 'about':
        addLines([
          { type: 'output', content: '\n  Amrit Sinha' },
          { type: 'output', content: '  SAP Hybris Backend Developer & AI Tools Enthusiast\n' },
          { type: 'output', content: '  Building enterprise-grade backends by day,' },
          { type: 'output', content: '  exploring MCP servers and AI tooling by night.\n' },
          { type: 'output', content: '  Currently focused on bridging CI/CD pipelines' },
          { type: 'output', content: '  with AI through the Model Context Protocol.\n' },
        ]);
        break;

      case 'skills':
        addLines([
          { type: 'success', content: '\n── Backend ──────────────────────' },
          { type: 'output', content: '  ' + skills.backend.join(' · ') },
          { type: 'success', content: '\n── Frontend ─────────────────────' },
          { type: 'output', content: '  ' + skills.frontend.join(' · ') },
          { type: 'success', content: '\n── DevOps ───────────────────────' },
          { type: 'output', content: '  ' + skills.devops.join(' · ') },
          { type: 'success', content: '\n── Data ─────────────────────────' },
          { type: 'output', content: '  ' + skills.data.join(' · ') },
          { type: 'success', content: '\n── Tools ────────────────────────' },
          { type: 'output', content: '  ' + skills.tools.join(' · ') + '\n' },
        ]);
        break;

      case 'projects':
        addLines([
          { type: 'output', content: '' },
          ...projects.map(p => ({
            type: (p.status === 'live' ? 'success' : 'output') as TerminalLine['type'],
            content: `  ${p.status === 'live' ? '●' : p.status === 'in-progress' ? '◐' : '○'} ${p.name.padEnd(28)} [${p.status}]`,
          })),
          { type: 'output', content: '\n  Use "project <name>" for details.\n' },
        ]);
        break;

      case 'project': {
        const query = args.join(' ');
        const found = projects.find(p => p.name.toLowerCase().includes(query) || p.id.includes(query));
        if (!found) {
          addLines([{ type: 'error', content: `  Project "${query}" not found. Try "projects" to list all.` }]);
        } else {
          addLines([
            { type: 'success', content: `\n  ═══ ${found.name} ═══` },
            { type: 'output', content: `  ${found.description}` },
            { type: 'output', content: `\n  Stack: ${found.tech.join(', ')}` },
            { type: 'output', content: `  Status: ${found.status}` },
            ...(found.github ? [{ type: 'output' as const, content: `  GitHub: ${found.github}` }] : []),
            ...(found.link ? [{ type: 'output' as const, content: `  Live: ${found.link}` }] : []),
            { type: 'output', content: '' },
          ]);
        }
        break;
      }

      case 'experience':
        addLines([
          { type: 'output', content: '' },
          { type: 'success', content: '  SAP Hybris Developer @ Your Company' },
          { type: 'output', content: '  2022 — Present\n' },
          { type: 'output', content: '  • Built SAP Commerce Cloud storefronts (1M+ users)' },
          { type: 'output', content: '  • Designed microservices for order management' },
          { type: 'output', content: '  • Implemented CI/CD pipelines (-60% deploy time)\n' },
        ]);
        break;

      case 'contact':
        addLines([
          { type: 'output', content: '\n  📧 Email:    amrit.01sinha@gmail.com' },
          { type: 'output', content: '  💼 LinkedIn: linkedin.com/in/yourprofile' },
          { type: 'output', content: '  🐙 GitHub:   github.com/yourusername' },
          { type: 'output', content: '  🌐 Website:  amrit.dev\n' },
        ]);
        break;

      case 'mcp':
        if (args[0] === 'status') {
          addLines([
            { type: 'success', content: '\n  MCP CI/CD Server v0.1.0' },
            { type: 'output', content: '  Status:    ● Online' },
            { type: 'output', content: '  Transport: stdio | SSE' },
            { type: 'output', content: '  Tools:     5 registered' },
            { type: 'output', content: '  Uptime:    3d 14h 22m\n' },
          ]);
        } else if (args[0] === 'pipelines') {
          addLines([
            { type: 'output', content: '' },
            { type: 'success', content: '  ● portfolio-deploy    [passing]  2m ago' },
            { type: 'success', content: '  ● lint-and-test       [passing]  5m ago' },
            { type: 'output', content: '  ◐ e2e-tests           [running]  now' },
            { type: 'error',   content: '  ✕ staging-deploy      [failed]   1h ago' },
            { type: 'output', content: '' },
          ]);
        } else if (args[0] === 'deploy') {
          addLines([
            { type: 'output', content: '\n  Triggering deployment...' },
            { type: 'output', content: '  ▸ Building project...' },
            { type: 'output', content: '  ▸ Running tests...' },
            { type: 'output', content: '  ▸ Deploying to Vercel...' },
            { type: 'success', content: '  ✓ Deployment successful!' },
            { type: 'output', content: '  Live at: https://amrit.dev\n' },
          ]);
        } else {
          addLines([
            { type: 'output', content: '\n  MCP CI/CD Commands:' },
            { type: 'output', content: '    mcp status    — Server status' },
            { type: 'output', content: '    mcp pipelines — List pipelines' },
            { type: 'output', content: '    mcp deploy    — Trigger deploy\n' },
          ]);
        }
        break;

      case 'neofetch':
        addLines([
          { type: 'output', content: '' },
          { type: 'success', content: '        .---.         amrit@portfolio' },
          { type: 'success', content: '       /     \\        ────────────────────' },
          { type: 'success', content: '      |  () () |      OS: macOS Portfolio v1.0' },
          { type: 'success', content: '      |   __   |      Shell: zsh 5.9' },
          { type: 'success', content: '       \\  \\/  /       Terminal: portfolio-term' },
          { type: 'success', content: '        \'----\'        Resolution: ' + window.innerWidth + 'x' + window.innerHeight },
          { type: 'output', content: '                      Stack: React + Vite + TS' },
          { type: 'output', content: '                      MCP: CI/CD Server v0.1.0' },
          { type: 'output', content: '                      Uptime: since you opened this tab' },
          { type: 'output', content: '' },
        ]);
        break;

      case 'whoami':
        addLines([{ type: 'output', content: '  amrit' }]);
        break;

      case 'date':
        addLines([{ type: 'output', content: '  ' + new Date().toString() }]);
        break;

      case 'uname':
        addLines([{ type: 'output', content: '  PortfolioOS 1.0.0 React-Vite aarch64' }]);
        break;

      case 'pwd':
        addLines([{ type: 'output', content: '  /Users/amrit/portfolio' }]);
        break;

      case 'ls':
        addLines([
          { type: 'output', content: '  about.md    projects/    skills.json    contact.md' },
          { type: 'output', content: '  README.md   .mcp/        terminal.sh    resume.pdf' },
        ]);
        break;

      case 'echo':
        addLines([{ type: 'output', content: '  ' + args.join(' ') }]);
        break;

      case 'sudo':
        addLines([{ type: 'error', content: '  Nice try. No root access on portfolio machines. 😏' }]);
        break;

      case 'vim':
      case 'nano':
      case 'emacs':
        addLines([{ type: 'error', content: `  ${command}: editor wars not supported. Use VS Code like a normal person.` }]);
        break;

      case 'exit':
        addLines([{ type: 'output', content: '  Why would you leave? Stay a while! 🙂' }]);
        break;

      default:
        addLines([{ type: 'error', content: `  zsh: command not found: ${command}` }]);
        break;
    }
  }, [addLines]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setHistory(prev => [input, ...prev]);
      setHistoryIndex(-1);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="app-terminal" onClick={() => inputRef.current?.focus()} ref={scrollRef}>
      <div className="terminal-lines">
        {lines.map((line, i) => (
          <div key={i} className={`terminal-line ${line.type}`}>
            <pre>{line.content}</pre>
          </div>
        ))}
      </div>
      <div className="terminal-input-line">
        <span className="terminal-prompt">amrit@portfolio ~ %&nbsp;</span>
        <input
          ref={inputRef}
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoFocus
        />
      </div>
    </div>
  );
}
