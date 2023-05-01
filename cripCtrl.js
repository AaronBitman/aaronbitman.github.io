app.controller('cripCtrl', function($scope) {

    // Function to find all plaintext words that
    // match the ciphertext word the user entered.
    $scope.solve = function() {
        let candidates = getCandidates(getWordPattern($scope.ciphertext));
        if (candidates.length == 0)
          $scope.plaintext = "No ciphertext words found";
        else {
          $scope.plaintext = ""
          for (candidate of candidates) {
            if (conformsToLikeExclusion(candidate))
              $scope.plaintext += candidate + " ";
          }
        }
    }

    // Function to clear the HTML form.
    $scope.clear = function() {
        $scope.ciphertext = "";
        $scope.likeexclusion = false;
    }

    // Function to determine the cryptogram-dictionary key. For
    // example, getWordPattern("PEOPLE") will return "ABCADB".
    // Note that this function assumes the ciphertext has no
    // characters other than capital letters and apostrophes.
    function getWordPattern(ciphertext) {
        let temp = ""; // The value to be built and returned
        let letterIndex = "A"; // The next letter to use.
        // Increment through the ciphertext, character by character.
        for (let index1 = 0; index1 < ciphertext.length; index1++) {
          // An apostrophe translates to itself.
          if (ciphertext.charAt(index1) == "'")
            temp += "'";
          else {
            let index2 = ciphertext.indexOf(ciphertext.charAt(index1));
            // If the letter appeared before, use the same key letter for it.
            if (index2 >= 0  && index2 < index1)
              temp += temp.charAt(index2);
            // Otherwise, use a new character and increment
            // the "new" character for its next use.
            else {
              temp += letterIndex;
              letterIndex = String.fromCharCode(letterIndex.charCodeAt() + 1)
            }
          }
        }
        return temp;
    }

    // Determine if a candidate plaintext word conforms to like-exclusion.
    function conformsToLikeExclusion(plaintext) {
      // If the user didn't select Like Exclusion,
      // then obviously nothing violates it.
      if (!$scope.likeexclusion)
        return true;
      // Otherwise, loop through the ciphertext word.
      for (let index = 0; index < plaintext.length; index++) {
        // An apostrophe translates to itself, of course.
        if (plaintext[index] != "'")
          // Anything else must not be like the corresponding
          // character in the user's entered ciphertext word.
          if (plaintext[index] == $scope.ciphertext[index])
            return false;
      }
      // We didn't find any violation, so it must conform.
      return true;
    }
});