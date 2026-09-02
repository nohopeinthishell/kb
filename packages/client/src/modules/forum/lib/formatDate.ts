// Экземпляр форматтера создаётся один раз на модуль: Intl.DateTimeFormat
// дорогой в конструировании, а в списке он вызывается на каждую строку.
const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  // Таймзона задана явно — иначе сервер (UTC) и браузер пользователя
  // отформатируют одну и ту же дату по-разному, и гидрация разойдётся.
  timeZone: 'Europe/Moscow',
})

export const formatTopicDate = (iso: string) => dateFormat.format(new Date(iso))
