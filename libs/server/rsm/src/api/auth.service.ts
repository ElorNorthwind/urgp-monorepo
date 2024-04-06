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

    try {
      await Promise.all([
        page.waitForNavigation(),
        page.goto('http://webrsm.mlc.gov:5222/'),
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
