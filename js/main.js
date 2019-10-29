// IIFE for variable scoping
(function() {
    // variable declaration
    var request = new XMLHttpRequest();
    var searchInput = document.getElementById("search");
    var clearSearch = document.getElementById("clear-search");
    var autoCompleteContainer = document.getElementsByClassName("auto-complete-container")[0];
    var searchHistoryContainer = document.getElementsByClassName("search-history-container")[0];
    var searchHistoryListContainer = document.getElementsByClassName("search-history-list-container")[0];
    var autoCompleteItemTemplate = document.getElementById("auto-complete-template");
    var searchHistoryItemTemplate = document.getElementById("search-history-template");
    var clearAllHistory = document.getElementById("clear-all");

    // setting initially value
    searchHistoryContainer.style.display = "none";

    // adding event listeners
    searchInput.addEventListener("input", sendRequest);
    clearSearch.addEventListener("click", clearSearchValue);
    clearAllHistory.addEventListener("click", clearAll);

    // sending ajax request
    function sendRequest() {
        request.abort();
        if (this.value.length === 0) {
            clearAutoComplete();
            return false;
        }

        var url = `https://restcountries.eu/rest/v2/name/${this.value}?fields=name;capital;fullText=true`;
        try {
            request.onreadystatechange = function() {
                if (this.status === 200) {
                    autocompleteItems(this.response);
                } else if (this.status === 404) {
                    requestError();
                    request.abort();
                }
            };
            request.responseType = "json";
            request.open("GET", url, true);
            request.send();
        } catch (e) {
            requestError();
            request.abort();
        }
    }

    // handling error
    function requestError() {
        clearAutoComplete();
    }

    // clearing search value
    function clearSearchValue() {
        request.abort();
        searchInput.value = "";
        searchInput.focus();
        clearAutoComplete();
    }

    // clearing auto complete list
    function clearAutoComplete() {
        removeChildrens(autoCompleteContainer);
        autoCompleteContainer.textContent = "";
    }

    // adding atuo complete items
    function autocompleteItems(response) {
        if (!response || response.length == 0) {
            return false;
        }
        clearAutoComplete();

        // adding items from request 
        response.forEach((entries) => {
            var node = autoCompleteItemTemplate.content.cloneNode(true);
            var item = node.querySelector(".auto-complete-items");
            item.textContent = entries.name;
            item.addEventListener("click", itemClick);
            autoCompleteContainer.appendChild(node);
        });
    }

    // search query clicked
    function itemClick() {
        searchInput.focus();
        searchInput.value = "";
        clearAutoComplete();
        searchHistoryContainer.style.display = "block";
        createSearchHistory({ text: this.textContent, date: new Date().toLocaleString() });
    }

    // creating new search history item
    function createSearchHistory(searches) {
        var node = searchHistoryItemTemplate.content.cloneNode(true);
        var text = node.querySelector(".history-items");
        var date = node.querySelector(".date-time");
        var clear = node.querySelector(".close-button");
        text.textContent = searches.text;
        date.textContent = searches.date;
        clear.addEventListener("click", clearSearchClick);
        searchHistoryListContainer.appendChild(node);
    }

    // clearing search history item
    function clearSearchClick() {
        searchHistoryListContainer.removeChild(this.parentElement.parentElement);
        hideSearchHistory();
    }

    // clearing all history items
    function clearAll() {
        removeChildrens(searchHistoryListContainer);
        hideSearchHistory();
    }

    // general function to remove children elements
    function removeChildrens(container) {
        while (container.children.length !== 0) {
            container.removeChild(container.lastChild);
        }
    }

    // hiding search history when no items are present
    function hideSearchHistory() {
        if (searchHistoryListContainer.children.length === 0) {
            searchHistoryListContainer.textContent = "";
            searchHistoryContainer.style.display = "none";
        }
    }

})();