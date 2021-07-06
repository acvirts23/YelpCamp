//func is passed in
//Returns a new function that executes func, and catches any errors
//And passes those errors to next
module.exports = func => {
    return(req, res, next) => {
        func(req, res, next).catch(next);
    }
}