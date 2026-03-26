import { WindowProvider, useWindows } from './contexts/WindowContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MenuBar from './components/MenuBar/MenuBar';
import Desktop from './components/Desktop/Desktop';
import Dock from './components/Dock/Dock';
import Window from './components/Window/Window';
import AboutMe from './components/apps/AboutMe';
import Projects from './components/apps/Projects';
import Terminal from './components/apps/Terminal';
import Contact from './components/apps/Contact';
import Skills from './components/apps/Skills';

const appComponents: Record<string, React.ComponentType> = {
  about: AboutMe,
  projects: Projects,
  terminal: Terminal,
  contact: Contact,
  skills: Skills,
};

function WindowLayer() {
  const { windows } = useWindows();

  return (
    <>
      {windows.map(w => {
        const AppComponent = appComponents[w.appId];
        if (!AppComponent) return null;
        return (
          <Window key={w.id} windowState={w}>
            <AppComponent />
          </Window>
        );
      })}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <WindowProvider>
        <div className="macos-desktop-app">
          <MenuBar />
          <Desktop />
          <WindowLayer />
          <Dock />
        </div>
      </WindowProvider>
    </ThemeProvider>
  );
}
