import { InlineKeyboard, Keyboard } from 'grammy'

export const subscribeKeyboard = new InlineKeyboard()
  .url('Подписаться', 'https://t.me/psymoneychannel')
  .row()
  .text('Проверить подписку', 'checkSub')

export const adKeyboard = new InlineKeyboard().text(
  'Получить',
  'initiateSecond'
)

export const phoneKeyboard = new Keyboard().requestContact(
  'Отправить номер телефона'
)

export const webAppKeyboard = {
  inline_keyboard: [
    [
      {
        text: 'Оферта',
        web_app: { url: '' },
        resize: true,
      },
    ],
  ],
}
