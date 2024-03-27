import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import fs from 'fs';
import { diskStorage } from 'multer';
import path, { join } from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  getRootPath(): string {
    return process.cwd();
  }

  ensureDirExists(targetDirectory: string): void {
    fs.mkdir(targetDirectory, { recursive: true }, (err) => {
      if (!err) {
        console.log('Error creating directory:', err);
        return;
      }
      switch (err.code) {
        case 'EEXIST':
          console.log('Directory already exists');
          break;
        case 'ENOTDIR':
          console.log('Parent directory is not a directory');
          break;
        default:
          console.log('Error creating directory:', err);
          break;
      }
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req?.headers?.folder_type ?? 'default';
          this.ensureDirExists(`public/images/${folder}`);
          cb(null, join(this.getRootPath(), `public/images/${folder}`));
        },
        filename: (req, file, cb) => {
          //get image extension
          const extName = path.extname(file.originalname);

          //get image's name (without extension)
          const baseName = path.basename(file.originalname, extName);

          const finalName = `${baseName}-${Date.now()}${extName}`;

          cb(null, finalName);
        },
      }),
    };
  }
}
