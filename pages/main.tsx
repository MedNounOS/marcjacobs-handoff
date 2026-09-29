import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Workspace from '@/app/workspace';
import {configureGitHub} from '@/lib/github-store';
import '@/app/globals.css';
configureGitHub({owner:'MedNounOS',repo:'marcjacobs-handoff',branch:'main',file:'workspace/workspace.json'});
createRoot(document.getElementById('root')!).render(<StrictMode><Workspace/></StrictMode>);
