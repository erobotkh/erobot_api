import { convertCSVToArray } from 'convert-csv-to-array'
import axios from 'axios'

export const sheetToObject = async (googleSheetEndPoint) => {
  const { data } = await axios.get(googleSheetEndPoint)

  let arrayData = convertCSVToArray(data, {
    type: 'array',
    separator: '',
  })

  const fields = arrayData[0]
  arrayData = arrayData.slice(1)

  const objectData = arrayData.map((e) => {
    let obj = {}
    for (let i = 0; i < e.length; i++) {
      // role: 'coleader'
      obj[fields[i].trim()] = e[i].trim()
    }
    return obj
  })

  return objectData
}