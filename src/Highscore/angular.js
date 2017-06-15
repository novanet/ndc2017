(function() {
    'use strict';

    angular
        .module('app', [])
        .controller('controller', controller)
        .factory('dataservice', dataservice);

    controller.$inject = ['dataservice', '$timeout'];
    dataservice.$inject = ['$q', '$http'];

    function controller(dataservice, $timeout) {
		//Timeouts
		var slidesTimeIntervalInMs = 6000;
		var dataPollingIntervalInMs = 3000; 		
		
		var vm = this;

        vm.currentPage = 2;
        vm.currentSlideShowPage = 1;
		vm.emotionHeaderTexts = [];
        vm.error = null;
        vm.goToPage = goToPage;
		vm.highscore = [];
        vm.isBusyLoading = true;
        vm.latestPhoto = {};	
        vm.slideShow = [];
		
		//Init		
		getHighscore();
		getLatestPhoto();
				
		startSlideshow();
		
		//Start polling for data for highscore and lastest photo
		$timeout(pollForData, dataPollingIntervalInMs);		
		
		function pollForData(){
			getHighscore();
			getLatestPhoto();
				
			$timeout(pollForData, dataPollingIntervalInMs);
		}
		
		function getHighscore(){
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
				})
				.finally(function() {
					vm.isBusyLoading = false;
				});				
		}

		function startSlideshow(){
			  var slideTimer =
				$timeout(function interval() {
				  var slideShowLength = !!vm.slideShow ? vm.slideShow.length : 0;
				  vm.currentSlideShowPage = (vm.currentSlideShowPage % vm.slideShow.length) + 1;
				  slideTimer = $timeout(interval, slidesTimeIntervalInMs);
				}, slidesTimeIntervalInMs);
		}

        function goToPage(page){
            vm.currentPage = page;
        }
		
		function getLatestPhoto(){
			dataservice.getLatestPhoto()
				.then(function(result){
                    vm.latestPhoto = {};

                    vm.latestPhoto.blobUri = result[0].BlobUri;
                    vm.latestPhoto.name = result[0].Name;
                    vm.latestPhoto.highestScore = result[0].HighestScore;

					vm.latestPhoto.emotions = [];
                    vm.latestPhoto.emotions.push({'name': 'Anger', 'score': result[0].AngerScore, 'rank': result[0].RankAnger });
                    vm.latestPhoto.emotions.push({'name': 'Contempt', 'score': result[0].ContemptScore, 'rank': result[0].RankContempt });
                    vm.latestPhoto.emotions.push({'name': 'Disgust', 'score': result[0].DisgustScore, 'rank': result[0].RankDisgust });
                    vm.latestPhoto.emotions.push({'name': 'Fear', 'score': result[0].FearScore, 'rank': result[0].RankFear });
                    vm.latestPhoto.emotions.push({'name': 'Happiness', 'score': result[0].HappinessScore, 'rank': result[0].RankHappiness });
                    vm.latestPhoto.emotions.push({'name': 'Neutral', 'score': result[0].NeutralScore, 'rank': result[0].RankNeutral });
                    vm.latestPhoto.emotions.push({'name': 'Sadness', 'score': result[0].SadnessScore, 'rank': result[0].RankSadness });
                    vm.latestPhoto.emotions.push({'name': 'Surprise', 'score': result[0].SurpriseScore, 'rank': result[0].RankSurprise });
				});
		}
    }

    function dataservice($q, $http) {
        return {
            getHighscore: getHighscore,
			getLatestPhoto: getLatestPhoto
        }

        function getHighscore() {
            return $q(function(resolve, reject) {
                $http.get('http://novanet-ndc-highscore.azurewebsites.net/api/highscore')
                    .then(function(response) {
                        resolve(response.data);
                    });
            });
        }
		
		function getLatestPhoto() {
            return $q(function(resolve, reject) {
                $http.get('http://novanet-ndc-highscore.azurewebsites.net/api/lastPhoto')
                    .then(function(response) {
                        resolve(response.data);
                    });
            });
        }
    }
})();
