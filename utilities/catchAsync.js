/* Here we are returning a function THAT
    accepts a function,
    executes it, 
    and any errors are caught and passed to next().
    
    It will wrap asyncronous functions
*/

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}