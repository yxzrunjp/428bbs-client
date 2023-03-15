export const Confirm = (msg, title, cb) => {
    ElMessageBox.confirm(msg, title, { confirmButtonText: '确认', cancelButtonText: '取消', type: 'info' }).then(() => {
        cb()
    }).catch(err => { })
}