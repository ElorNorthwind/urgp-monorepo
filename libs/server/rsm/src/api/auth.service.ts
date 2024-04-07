import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class RsmAuthService {
  public async getRsmAuthToken(
    login: string,
    password: string,
  ): Promise<string> {
    const browser = await puppeteer.launch({ headless: 'shell' });
    const page = await browser.newPage();
    const ip = `http://10.15.179.52:5222`;
    const url = `http://webrsm.mlc.gov:5222`;

    // change redirects to IP not DNS
    page.on('request', (req) => {
      // only for adresses that include hostname and are not on sudir page directly
      if (!req.url().includes(url) || req.url().includes('sudir.mos.ru'))
        return;

      // Replace hostname to IP in redirect adress
      page.goto(req.url().replace(url, ip));
    });

    try {
      await Promise.all([
        page.waitForNavigation(),
        page.goto(ip, { waitUntil: 'networkidle0' }), // I know, I know, it's slow. But kinda needed here :(
      ]);

      await page.type('#login', login);
      await page.type('#password', password);

      await Promise.all([page.waitForNavigation(), page.click('#bind')]);

      const cookies = await page.cookies();

      console.log(
        cookies.find((cookie) => {
          return cookie.name === 'Rsm.Cookie';
        })?.value || '',
      );

      return (
        cookies.find((cookie) => {
          return cookie.name === 'Rsm.Cookie';
        })?.value || ''
      );
    } catch (e) {
      console.log(e);
      return '';
    } finally {
      browser.close();
    }
  }
}
