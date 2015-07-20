'use strict';

/**
 * Responsible for writing history to a file
 *
 * @param {String} filename
 * @param {Object} fs module
 */
module.exports = function SessionWriter(filename, fs) {

  /**
   * Writes the built up history to a file
   *
   * @param {History} history
   * @param {Function} done
   */
  this.write = function(history, done) {
    fs.writeFile(filename, prepareHistory(history.getEntries()), done);
  };

  /**
   * Converts the entries into a string
   *
   * @param {Array<Entry>} entries
   * @return {String}
   */
  var prepareHistory = function(entries) {
    return entries.map(function(entry) {
      return entry.getLine().getLine() + '\n\n' + 
        ' > ' + entry.getResponse().serialize().split('\n').join('\n > ');
    }).join('\n\n') + '\n';
  };

};
