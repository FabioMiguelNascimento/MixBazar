import { All, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { auth } from './auth.js';

/** Encaminha /v1/auth/* para o handler do Better Auth. */
@Controller('auth')
export class AuthController {
  @All('{*path}')
  async handle(@Req() req: Request, @Res() res: Response) {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const webReq = new Request(url, {
      method: req.method,
      headers: req.headers as unknown as HeadersInit,
      body:
        req.method === 'GET' || req.method === 'HEAD'
          ? undefined
          : JSON.stringify(req.body ?? {}),
    });
    const webRes = await auth.handler(webReq);
    res.status(webRes.status);
    webRes.headers.forEach((v, k) => res.setHeader(k, v));
    const text = await webRes.text();
    res.send(text);
  }
}
