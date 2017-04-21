(function () {
    'use strict';

    angular
        .module('app', [])
        .controller('controller', controller)
        .factory('dataservice', dataservice);

    controller.$inject = ['dataservice'];
    dataservice.$inject = ['$q', '$http'];

    function controller(dataservice) {
        var vm = this;
        vm.error = null;
        vm.isBusyLoading = true;
                 
        dataservice.getHighscore()
            .then(function(result){
                vm.highscore = _(result)
								.groupBy(x => x.Emotion)
								.map((value, key) => ({emotion: key, highscore: value}))
								.value();
            })
			.finally(function(){
				vm.isBusyLoading = false;
			});
    }

    function dataservice($q, $http) {
        return {
            getHighscore: getHighscore
        }   
        
        function getHighscore() {
            return $q(function (resolve, reject) {
                $http.get('http://novanet-ndc-highscore.azurewebsites.net/api/highscore')
                    .then(function (response) {
                        resolve(response.data);
                    });
            });
        }         
    }
})();