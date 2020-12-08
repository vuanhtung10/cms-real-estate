const isSubset = (superset, subset) => {
  if (subset.length === 0) {
    return true
  }
  if (superset.length < subset.length) {
    return false
  }
  for (let i = 0; i < subset.length; i++) {
    if (!superset.includes(subset[i])) return false
  }
  return true
}

export const checkPerm = (requiredPerms, ownPermissions) => {
  let hasPermission = true
  const permStack = []
  let orArray = []
  if (!requiredPerms) {
    return true
  }
  if (Array.isArray(requiredPerms)) {
    if (requiredPerms.length === 0) {
      return true
    }
    orArray = requiredPerms
  } else {
    orArray = requiredPerms.split('|')
  }
  for (let i = 0; i < orArray.length; i++) {
    const e = orArray[i]
    if (e.includes('&')) {
      permStack.push(e.split('&'))
    } else {
      permStack.push(e)
    }
  }

  for (let i = 0; i < permStack.length; i++) {
    const e = permStack[i]
    if (Array.isArray(e)) {
      if (isSubset(ownPermissions, e)) {
        return true
      }
      hasPermission = false
    } else {
      if (ownPermissions.includes(e)) {
        return true
      }
      hasPermission = false
    }
  }
  return hasPermission
}
