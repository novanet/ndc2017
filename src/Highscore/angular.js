(function() {
    'use strict';

    angular
        .module('app', [])
        .controller('controller', controller)
        .factory('dataservice', dataservice);

    controller.$inject = ['dataservice', '$timeout'];
    dataservice.$inject = ['$q', '$http'];

    function controller(dataservice, $timeout) {
		var slidesTimeIntervalInMs = 3000;
		var vm = this;

		vm.currentSlideShowPage = 1;
		vm.emotionHeaderTexts = [];
        vm.error = null;
		vm.highscore = [];
        vm.isBusyLoading = true;
		vm.slideShow = [];

        dataservice.getHighscore()
            .then(function(result) {
                vm.highscore = _(result)
                    .groupBy(x => x.Emotion)
                    .map((value, key) => ({
                        emotion: key,
                        highscore: value
                    }))
                    .value();

					vm.slideShow = _.filter(result, function(r) {
						return parseInt(r.Rank) === 1;
					});

					startSlideshow();
            })
            .finally(function() {
                vm.isBusyLoading = false;
            });

		function startSlideshow(){
			  var slideTimer =
				$timeout(function interval() {
				  vm.currentSlideShowPage = (vm.currentSlideShowPage % vm.slideShow.length) + 1;
				  slideTimer = $timeout(interval, slidesTimeIntervalInMs);
				}, slidesTimeIntervalInMs);

		}
    }

    function dataservice($q, $http) {
        return {
            getHighscore: getHighscore
        }

        function getHighscore() {
            return $q(function(resolve, reject) {
                $http.get('http://novanet-ndc-highscore.azurewebsites.net/api/highscore')
                    .then(function(response) {
                        resolve(response.data);
                    });
            });
        }
    }
})();