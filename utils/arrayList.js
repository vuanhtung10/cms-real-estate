export const moveItem = (list, index, direction) => {
  const tmp = { ...list[index] }
  if (direction === 'down') {
    if (index === list.length - 1) {
      list.splice(index, 1)
      list.unshift(tmp)
    } else {
      list.splice(index, 1, list[index + 1])
      list.splice(index + 1, 1, tmp)
    }
  } else if (direction === 'up') {
    if (index === 0) {
      list.splice(index, 1)
      list.push(tmp)
    } else {
      list.splice(index, 1, list[index - 1])
      list.splice(index - 1, 1, tmp)
    }
  }
  return list
}

export const getIndexInArrayById = (array, id) => {
  let index = 0
  array.forEach((item, i) => {
    if (item._id.toString() === id.toString()) {
      index = i
    }
  })
  return index
}

export const checkExistById = (array, _id) => {
  return array.some(function(el) {
    return el._id === _id
  })
}
