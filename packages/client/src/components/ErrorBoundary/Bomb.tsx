// ВРЕМЕННЫЙ компонент для проверки ErrorBoundary — удалить после проверки.
// Бросает во время рендера, только если в адресе есть ?boom,
// чтобы не ломать приложение при каждом запуске.
const Bomb = () => {
  if (window.location.search.includes('boom')) {
    throw new Error('Тестовая ошибка рендера')
  }
  return null
}

export default Bomb
