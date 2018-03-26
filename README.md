# Lightning Application Container
A Salesforce lightning ui framework to build lightning applications faster. It provides some javascript utility methods that helps in writing less code and doing more in an efficient way.

### Features
  - **Navigation** - Framework provides a way to navigate through different components both forward and backword.
  - **Data Service** - Data service provides some useful apex utility methods that help in executing crud operations on any object type through javascript. It also provides few object metadata utility methods like get record types or get field set data for any object type.
  - **Helper Utility Methods** - Framework appends some utility methods to your component's helper object. These helper methods are inspired from underscore.js and promise.

### Aura Components
* [Component Base](https://github.com/sgupta9591/lightning-application-container/tree/master/src/aura/ComponentBase) - provides basic javascript helper utility methods.
* [Application Base](https://github.com/sgupta9591/lightning-application-container/tree/master/src/aura/ApplicationBase) - provides navigation and data service.
* [Application Container](https://github.com/sgupta9591/lightning-application-container/tree/master/src/aura/ApplicationContainer) - provides navigation functionality.
* [Data Service](https://github.com/sgupta9591/lightning-application-container/tree/master/src/aura/DataService) - provides apex utility methods.
* [Page Header](https://github.com/sgupta9591/lightning-application-container/tree/master/src/aura/PageHeader) - provides a page header that consists of a title, subtitle, back button and action buttons.
* [Init Data Service Event](https://github.com/sgupta9591/lightning-application-container/tree/master/src/aura/InitDataService) - to initialize data service component. 
* [Navigate To Component Event](https://github.com/sgupta9591/lightning-application-container/tree/master/src/aura/NavigateToComponent) - to navigate to another component.
* [Navigate To Previous Component Event](https://github.com/sgupta9591/lightning-application-container/tree/master/src/aura/NavigateToPreviousComponent) - to navigate back to previous component.
* [Show Hide Spinner Event](https://github.com/sgupta9591/lightning-application-container/tree/master/src/aura/ShowHideSpinner) - to show or hide spinner.
* [Refresh View Event](https://github.com/sgupta9591/lightning-application-container/tree/master/src/aura/RefreshView) - to fire standard refresh view event and to refresh other application container instances.

### Apex Classes
* [Data Service Controller](https://github.com/sgupta9591/lightning-application-container/blob/master/src/classes/DataService_CC.cls) - a apex controller for data service component.
* [Data Service Utility](https://github.com/sgupta9591/lightning-application-container/blob/master/src/classes/DataServiceUtility.cls) - provides apex utility methods and it is used by data service controller.
* [Metadata Utility](https://github.com/sgupta9591/lightning-application-container/blob/master/src/classes/MetadataServiceUtility.cls) - provides metadata utility methods and it is used by data service utility.

### Examples
See examples [here](https://sumit-gupta-developer-edition.ap5.force.com/examples).

### Installation 
Install the Lightning Application Container unmanaged package [here](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t7F000004ECnq).

### Contributors
[Sumit Gupta](https://github.com/sgupta9591),  Senior Technical Consultant at Salesforce