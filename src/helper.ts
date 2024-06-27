import { ToastController, AlertController } from '@ionic/angular';
import { Database, push, ref } from 'firebase/database';

export async function presentToast(
  msg: string,
  toastController: ToastController,
  duration: number
) {
  const toast = await toastController.create({
    message: msg,
    duration,
    position: 'bottom',
  });

  await toast.present();
}

export async function presentAlert(
  text: string,
  alertController: AlertController
) {
  const alert = await alertController.create({
    message: text,
    buttons: ['OK'],
  });

  await alert.present();
}

export function recordClick(
  action: number,
  db: Database,
  userId: number | string | null
) {
  const testAccId = '5FUtbbtMe4RNPys6QSUzri5UXFN2';
  const developerAccId = 'ZqdQyuc1uuTbAfmhkjw5HgLFnc82';

  if (userId == testAccId || userId == developerAccId) {
    return;
  }

  const obj: any = { action, timeStamp: new Date().getTime() };
  if (userId) {
    obj['userId'] = userId;
  }
  push(ref(db, 'move_follow_up_2023/clicks'), obj);
}

export function cgNum(cgName: string): number {
  var num = cgName.match(/\d+/g);
  if (num) {
    return parseInt(num[0]);
  } else {
    return 0;
  }
}
