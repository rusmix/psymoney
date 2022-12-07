import { InlineKeyboard, Keyboard } from 'grammy'

export const subscribeKeyboard = new InlineKeyboard()
  .url('Подписаться', 'https://t.me/psymoneychannel')
  .row()
  .text('Проверить подписку', 'checkSub')

export const adKeyboard = new InlineKeyboard().text(
  'Получить',
  'initiateSecond'
)

export const urlKeyboard = new InlineKeyboard().url('Вебинар', 'google.com')

export const phoneKeyboard = new Keyboard().requestContact(
  'Поделиться контактом'
)

export const getFileKeyboard = new InlineKeyboard().text(
  'Получить алгоритм',
  'getFile'
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
