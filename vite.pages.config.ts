import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
 root:path.resolve(import.meta.dirname,'pages'),
 base:'/marcjacobs-handoff/',
 plugins:[react()],
 resolve:{alias:{'@':path.resolve(import.meta.dirname)}},
 publicDir:path.resolve(import.meta.dirname,'public'),
 css:{postcss:path.resolve(import.meta.dirname)},
 build:{outDir:path.resolve(import.meta.dirname,'dist-pages'),emptyOutDir:true},
 server:{host:'127.0.0.1',port:5174,strictPort:true},
});
