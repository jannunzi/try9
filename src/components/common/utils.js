export const getCurrentDateTime = () => {
    const now = new Date()
    return `${now.getFullYear()}_${now.getMonth()+1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`
  }
