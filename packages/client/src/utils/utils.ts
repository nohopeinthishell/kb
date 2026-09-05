import guestHappyImage from '../assets/game/sprites/guest-happy.webp'
import guestUnhappyImage from '../assets/game/sprites/guest-unhappy.webp'
import guestNeutralImage from '../assets/game/sprites/guest-neutral.webp'

import tableNewImage from '../assets/game/sprites/table-new.webp'
import tableWornImage from '../assets/game/sprites/table-worn.webp'
import tableBrokenImage from '../assets/game/sprites/table-broken.webp'
import stoolImage from '../assets/game/sprites/stool.webp'
import tavernBackgroundImage from '../assets/game/sprites/tavern-background.webp'
import waitressImage from '../assets/game/sprites/waitress.webp'
import helperImage from '../assets/game/sprites/helper.webp'
import provisionsImage from '../assets/game/sprites/provisions.webp'

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`))

    image.src = src
  })
}

export const loadSprites = async () => {
  const [
    background,
    guestHappy,
    guestUnhappy,
    guestNeutral,
    tableNew,
    tableWorn,
    tableBroken,
    stool,
    waitress,
    helper,
    provisions,
  ] = await Promise.all([
    loadImage(tavernBackgroundImage),
    loadImage(guestHappyImage),
    loadImage(guestUnhappyImage),
    loadImage(guestNeutralImage),
    loadImage(tableNewImage),
    loadImage(tableWornImage),
    loadImage(tableBrokenImage),
    loadImage(stoolImage),
    loadImage(waitressImage),
    loadImage(helperImage),
    loadImage(provisionsImage),
  ])

  return {
    background,
    guests: {
      happy: guestHappy,
      unhappy: guestUnhappy,
      neutral: guestNeutral,
    },
    tables: {
      new: tableNew,
      worn: tableWorn,
      broken: tableBroken,
    },
    stool,
    waitress,
    helper,
    provisions,
  }
}
