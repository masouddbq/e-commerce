import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

const webConfigPath = join(process.cwd(), 'web.config');
const distPath = join(process.cwd(), 'dist', 'web.config');

if (existsSync(webConfigPath)) {
  try {
    copyFileSync(webConfigPath, distPath);
    console.log('✅ web.config copied to dist');
  } catch (error) {
    console.error('❌ Error copying web.config:', error.message);
    process.exit(1);
  }
} else {
  console.warn('⚠️  web.config not found, skipping...');
}


