'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Voleibol API</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-92822e6c3478b3f4a26f5ef6b21e18c10602393cf05e9fabd8aa47645a16f278ac2b07ba6024319cde00250a9cdf9606db3a01aa5a5e29e4b4800c3940844db9"' : 'data-target="#xs-controllers-links-module-AppModule-92822e6c3478b3f4a26f5ef6b21e18c10602393cf05e9fabd8aa47645a16f278ac2b07ba6024319cde00250a9cdf9606db3a01aa5a5e29e4b4800c3940844db9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-92822e6c3478b3f4a26f5ef6b21e18c10602393cf05e9fabd8aa47645a16f278ac2b07ba6024319cde00250a9cdf9606db3a01aa5a5e29e4b4800c3940844db9"' :
                                            'id="xs-controllers-links-module-AppModule-92822e6c3478b3f4a26f5ef6b21e18c10602393cf05e9fabd8aa47645a16f278ac2b07ba6024319cde00250a9cdf9606db3a01aa5a5e29e4b4800c3940844db9"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link" >CoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-d10d7c8c2d26ae4eff68d72d10843adce0ce7418642c927b451f81e9d152451bfcd60b68e89fb44043253e67833a2578bd54c7d9253cc4a9f64fbfa40dc00415"' : 'data-target="#xs-injectables-links-module-CoreModule-d10d7c8c2d26ae4eff68d72d10843adce0ce7418642c927b451f81e9d152451bfcd60b68e89fb44043253e67833a2578bd54c7d9253cc4a9f64fbfa40dc00415"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-d10d7c8c2d26ae4eff68d72d10843adce0ce7418642c927b451f81e9d152451bfcd60b68e89fb44043253e67833a2578bd54c7d9253cc4a9f64fbfa40dc00415"' :
                                        'id="xs-injectables-links-module-CoreModule-d10d7c8c2d26ae4eff68d72d10843adce0ce7418642c927b451f81e9d152451bfcd60b68e89fb44043253e67833a2578bd54c7d9253cc4a9f64fbfa40dc00415"' }>
                                        <li class="link">
                                            <a href="injectables/TypeORMFilterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TypeORMFilterService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VerificaUrlService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerificaUrlService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EquipeModule.html" data-type="entity-link" >EquipeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-EquipeModule-4b5d12b8a89efc1fc03244eaa68544be22c335823e1cbc630b73fe5b47cc54972c27a3d615a14cb326cf7572b0002b1e4c95274d42d8ed593821debc8a3efb53"' : 'data-target="#xs-controllers-links-module-EquipeModule-4b5d12b8a89efc1fc03244eaa68544be22c335823e1cbc630b73fe5b47cc54972c27a3d615a14cb326cf7572b0002b1e4c95274d42d8ed593821debc8a3efb53"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EquipeModule-4b5d12b8a89efc1fc03244eaa68544be22c335823e1cbc630b73fe5b47cc54972c27a3d615a14cb326cf7572b0002b1e4c95274d42d8ed593821debc8a3efb53"' :
                                            'id="xs-controllers-links-module-EquipeModule-4b5d12b8a89efc1fc03244eaa68544be22c335823e1cbc630b73fe5b47cc54972c27a3d615a14cb326cf7572b0002b1e4c95274d42d8ed593821debc8a3efb53"' }>
                                            <li class="link">
                                                <a href="controllers/EquipeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EquipeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EquipeModule-4b5d12b8a89efc1fc03244eaa68544be22c335823e1cbc630b73fe5b47cc54972c27a3d615a14cb326cf7572b0002b1e4c95274d42d8ed593821debc8a3efb53"' : 'data-target="#xs-injectables-links-module-EquipeModule-4b5d12b8a89efc1fc03244eaa68544be22c335823e1cbc630b73fe5b47cc54972c27a3d615a14cb326cf7572b0002b1e4c95274d42d8ed593821debc8a3efb53"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EquipeModule-4b5d12b8a89efc1fc03244eaa68544be22c335823e1cbc630b73fe5b47cc54972c27a3d615a14cb326cf7572b0002b1e4c95274d42d8ed593821debc8a3efb53"' :
                                        'id="xs-injectables-links-module-EquipeModule-4b5d12b8a89efc1fc03244eaa68544be22c335823e1cbc630b73fe5b47cc54972c27a3d615a14cb326cf7572b0002b1e4c95274d42d8ed593821debc8a3efb53"' }>
                                        <li class="link">
                                            <a href="injectables/EquipeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EquipeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EstatisticaModule.html" data-type="entity-link" >EstatisticaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-EstatisticaModule-6556d5c6b8b3ea8c28618d09d996852d8c47d0b8c73c869640b45aea74e45c85b3dd78ff12996a0f99e286bf6510efcd86fb159a9522f6c492fc30ae84c8c8ab"' : 'data-target="#xs-controllers-links-module-EstatisticaModule-6556d5c6b8b3ea8c28618d09d996852d8c47d0b8c73c869640b45aea74e45c85b3dd78ff12996a0f99e286bf6510efcd86fb159a9522f6c492fc30ae84c8c8ab"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EstatisticaModule-6556d5c6b8b3ea8c28618d09d996852d8c47d0b8c73c869640b45aea74e45c85b3dd78ff12996a0f99e286bf6510efcd86fb159a9522f6c492fc30ae84c8c8ab"' :
                                            'id="xs-controllers-links-module-EstatisticaModule-6556d5c6b8b3ea8c28618d09d996852d8c47d0b8c73c869640b45aea74e45c85b3dd78ff12996a0f99e286bf6510efcd86fb159a9522f6c492fc30ae84c8c8ab"' }>
                                            <li class="link">
                                                <a href="controllers/CraqueDaGaleraController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CraqueDaGaleraController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/FundamentoAtletaController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundamentoAtletaController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/MelhorCentralController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MelhorCentralController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/MelhorLiberoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MelhorLiberoController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/MelhorOpostoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MelhorOpostoController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/VotoDaGaleraController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VotoDaGaleraController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EstatisticaModule-6556d5c6b8b3ea8c28618d09d996852d8c47d0b8c73c869640b45aea74e45c85b3dd78ff12996a0f99e286bf6510efcd86fb159a9522f6c492fc30ae84c8c8ab"' : 'data-target="#xs-injectables-links-module-EstatisticaModule-6556d5c6b8b3ea8c28618d09d996852d8c47d0b8c73c869640b45aea74e45c85b3dd78ff12996a0f99e286bf6510efcd86fb159a9522f6c492fc30ae84c8c8ab"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EstatisticaModule-6556d5c6b8b3ea8c28618d09d996852d8c47d0b8c73c869640b45aea74e45c85b3dd78ff12996a0f99e286bf6510efcd86fb159a9522f6c492fc30ae84c8c8ab"' :
                                        'id="xs-injectables-links-module-EstatisticaModule-6556d5c6b8b3ea8c28618d09d996852d8c47d0b8c73c869640b45aea74e45c85b3dd78ff12996a0f99e286bf6510efcd86fb159a9522f6c492fc30ae84c8c8ab"' }>
                                        <li class="link">
                                            <a href="injectables/CraqueDaGaleraService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CraqueDaGaleraService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FundamentoAtletaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundamentoAtletaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MelhorCentralService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MelhorCentralService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MelhorLiberoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MelhorLiberoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MelhorOpostoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MelhorOpostoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VotoDaGaleraService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VotoDaGaleraService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GinasioModule.html" data-type="entity-link" >GinasioModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-GinasioModule-134b457c087657722049463f385804f8928168c32db24e8ad774e9f00e80a202f956e9ba13c5f7015f994a98100a083cab12f761820e1eb2cd42ba8c4e87e852"' : 'data-target="#xs-controllers-links-module-GinasioModule-134b457c087657722049463f385804f8928168c32db24e8ad774e9f00e80a202f956e9ba13c5f7015f994a98100a083cab12f761820e1eb2cd42ba8c4e87e852"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GinasioModule-134b457c087657722049463f385804f8928168c32db24e8ad774e9f00e80a202f956e9ba13c5f7015f994a98100a083cab12f761820e1eb2cd42ba8c4e87e852"' :
                                            'id="xs-controllers-links-module-GinasioModule-134b457c087657722049463f385804f8928168c32db24e8ad774e9f00e80a202f956e9ba13c5f7015f994a98100a083cab12f761820e1eb2cd42ba8c4e87e852"' }>
                                            <li class="link">
                                                <a href="controllers/GinasioController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GinasioController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-GinasioModule-134b457c087657722049463f385804f8928168c32db24e8ad774e9f00e80a202f956e9ba13c5f7015f994a98100a083cab12f761820e1eb2cd42ba8c4e87e852"' : 'data-target="#xs-injectables-links-module-GinasioModule-134b457c087657722049463f385804f8928168c32db24e8ad774e9f00e80a202f956e9ba13c5f7015f994a98100a083cab12f761820e1eb2cd42ba8c4e87e852"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GinasioModule-134b457c087657722049463f385804f8928168c32db24e8ad774e9f00e80a202f956e9ba13c5f7015f994a98100a083cab12f761820e1eb2cd42ba8c4e87e852"' :
                                        'id="xs-injectables-links-module-GinasioModule-134b457c087657722049463f385804f8928168c32db24e8ad774e9f00e80a202f956e9ba13c5f7015f994a98100a083cab12f761820e1eb2cd42ba8c4e87e852"' }>
                                        <li class="link">
                                            <a href="injectables/GinasioService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GinasioService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LigaModule.html" data-type="entity-link" >LigaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-LigaModule-8d399b5abff7a8136d7aa0792ae28eec1daacbd91939a0f3f0b3621a7c809df5727df9189ccb8e1994f40c71fed2dbf61e2ee3787f213cf6f757b6678e9c6546"' : 'data-target="#xs-controllers-links-module-LigaModule-8d399b5abff7a8136d7aa0792ae28eec1daacbd91939a0f3f0b3621a7c809df5727df9189ccb8e1994f40c71fed2dbf61e2ee3787f213cf6f757b6678e9c6546"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LigaModule-8d399b5abff7a8136d7aa0792ae28eec1daacbd91939a0f3f0b3621a7c809df5727df9189ccb8e1994f40c71fed2dbf61e2ee3787f213cf6f757b6678e9c6546"' :
                                            'id="xs-controllers-links-module-LigaModule-8d399b5abff7a8136d7aa0792ae28eec1daacbd91939a0f3f0b3621a7c809df5727df9189ccb8e1994f40c71fed2dbf61e2ee3787f213cf6f757b6678e9c6546"' }>
                                            <li class="link">
                                                <a href="controllers/LigaController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LigaController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LigaModule-8d399b5abff7a8136d7aa0792ae28eec1daacbd91939a0f3f0b3621a7c809df5727df9189ccb8e1994f40c71fed2dbf61e2ee3787f213cf6f757b6678e9c6546"' : 'data-target="#xs-injectables-links-module-LigaModule-8d399b5abff7a8136d7aa0792ae28eec1daacbd91939a0f3f0b3621a7c809df5727df9189ccb8e1994f40c71fed2dbf61e2ee3787f213cf6f757b6678e9c6546"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LigaModule-8d399b5abff7a8136d7aa0792ae28eec1daacbd91939a0f3f0b3621a7c809df5727df9189ccb8e1994f40c71fed2dbf61e2ee3787f213cf6f757b6678e9c6546"' :
                                        'id="xs-injectables-links-module-LigaModule-8d399b5abff7a8136d7aa0792ae28eec1daacbd91939a0f3f0b3621a7c809df5727df9189ccb8e1994f40c71fed2dbf61e2ee3787f213cf6f757b6678e9c6546"' }>
                                        <li class="link">
                                            <a href="injectables/ClassificacaoGeneratorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClassificacaoGeneratorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FinalGeneratorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FinalGeneratorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LigaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LigaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QuartaDeFinalGeneratorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QuartaDeFinalGeneratorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SemifinalGeneratorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SemifinalGeneratorService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PartidaModule.html" data-type="entity-link" >PartidaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PartidaModule-a95b89293feb350a1a7070d0fcb58d26d0583f00d1015b1e22511d8f48296f27fffcf7453808820c94e3f6b485d4af07a8871f1020583d0a633b1f604d6cc5be"' : 'data-target="#xs-controllers-links-module-PartidaModule-a95b89293feb350a1a7070d0fcb58d26d0583f00d1015b1e22511d8f48296f27fffcf7453808820c94e3f6b485d4af07a8871f1020583d0a633b1f604d6cc5be"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PartidaModule-a95b89293feb350a1a7070d0fcb58d26d0583f00d1015b1e22511d8f48296f27fffcf7453808820c94e3f6b485d4af07a8871f1020583d0a633b1f604d6cc5be"' :
                                            'id="xs-controllers-links-module-PartidaModule-a95b89293feb350a1a7070d0fcb58d26d0583f00d1015b1e22511d8f48296f27fffcf7453808820c94e3f6b485d4af07a8871f1020583d0a633b1f604d6cc5be"' }>
                                            <li class="link">
                                                <a href="controllers/PartidaController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PartidaController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PartidaModule-a95b89293feb350a1a7070d0fcb58d26d0583f00d1015b1e22511d8f48296f27fffcf7453808820c94e3f6b485d4af07a8871f1020583d0a633b1f604d6cc5be"' : 'data-target="#xs-injectables-links-module-PartidaModule-a95b89293feb350a1a7070d0fcb58d26d0583f00d1015b1e22511d8f48296f27fffcf7453808820c94e3f6b485d4af07a8871f1020583d0a633b1f604d6cc5be"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PartidaModule-a95b89293feb350a1a7070d0fcb58d26d0583f00d1015b1e22511d8f48296f27fffcf7453808820c94e3f6b485d4af07a8871f1020583d0a633b1f604d6cc5be"' :
                                        'id="xs-injectables-links-module-PartidaModule-a95b89293feb350a1a7070d0fcb58d26d0583f00d1015b1e22511d8f48296f27fffcf7453808820c94e3f6b485d4af07a8871f1020583d0a633b1f604d6cc5be"' }>
                                        <li class="link">
                                            <a href="injectables/AtletaEscaladoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AtletaEscaladoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PartidaFactory.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PartidaFactory</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PartidaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PartidaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SalvaPartidaFacade.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SalvaPartidaFacade</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PessoaModule.html" data-type="entity-link" >PessoaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PessoaModule-32db739ec27fb9e133b565517b931f39461d218cb8e63913373142eaaeace040a776c3a9bdd9d1a1c440fbf57b6a40f73712b111a100afdb65b39374e2e5b477"' : 'data-target="#xs-controllers-links-module-PessoaModule-32db739ec27fb9e133b565517b931f39461d218cb8e63913373142eaaeace040a776c3a9bdd9d1a1c440fbf57b6a40f73712b111a100afdb65b39374e2e5b477"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PessoaModule-32db739ec27fb9e133b565517b931f39461d218cb8e63913373142eaaeace040a776c3a9bdd9d1a1c440fbf57b6a40f73712b111a100afdb65b39374e2e5b477"' :
                                            'id="xs-controllers-links-module-PessoaModule-32db739ec27fb9e133b565517b931f39461d218cb8e63913373142eaaeace040a776c3a9bdd9d1a1c440fbf57b6a40f73712b111a100afdb65b39374e2e5b477"' }>
                                            <li class="link">
                                                <a href="controllers/ArbitroController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArbitroController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/AtletaController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AtletaController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/AuxiliarController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuxiliarController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DelegadoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DelegadoController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/TecnicoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TecnicoController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PessoaModule-32db739ec27fb9e133b565517b931f39461d218cb8e63913373142eaaeace040a776c3a9bdd9d1a1c440fbf57b6a40f73712b111a100afdb65b39374e2e5b477"' : 'data-target="#xs-injectables-links-module-PessoaModule-32db739ec27fb9e133b565517b931f39461d218cb8e63913373142eaaeace040a776c3a9bdd9d1a1c440fbf57b6a40f73712b111a100afdb65b39374e2e5b477"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PessoaModule-32db739ec27fb9e133b565517b931f39461d218cb8e63913373142eaaeace040a776c3a9bdd9d1a1c440fbf57b6a40f73712b111a100afdb65b39374e2e5b477"' :
                                        'id="xs-injectables-links-module-PessoaModule-32db739ec27fb9e133b565517b931f39461d218cb8e63913373142eaaeace040a776c3a9bdd9d1a1c440fbf57b6a40f73712b111a100afdb65b39374e2e5b477"' }>
                                        <li class="link">
                                            <a href="injectables/ArbitroService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArbitroService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AtletaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AtletaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuxiliarService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuxiliarService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DelegadoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DelegadoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TecnicoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TecnicoService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PontuacaoModule.html" data-type="entity-link" >PontuacaoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PontuacaoModule-e3945936dbf0c00132aa5a8d4d9fa9378653b7538087aa6ed61fa5759ab4435f5ca040aca92a94fe3866506270b1cf1b8a5bb9e995ae48c9db1a13428b3b3fe9"' : 'data-target="#xs-controllers-links-module-PontuacaoModule-e3945936dbf0c00132aa5a8d4d9fa9378653b7538087aa6ed61fa5759ab4435f5ca040aca92a94fe3866506270b1cf1b8a5bb9e995ae48c9db1a13428b3b3fe9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PontuacaoModule-e3945936dbf0c00132aa5a8d4d9fa9378653b7538087aa6ed61fa5759ab4435f5ca040aca92a94fe3866506270b1cf1b8a5bb9e995ae48c9db1a13428b3b3fe9"' :
                                            'id="xs-controllers-links-module-PontuacaoModule-e3945936dbf0c00132aa5a8d4d9fa9378653b7538087aa6ed61fa5759ab4435f5ca040aca92a94fe3866506270b1cf1b8a5bb9e995ae48c9db1a13428b3b3fe9"' }>
                                            <li class="link">
                                                <a href="controllers/PontuacaoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PontuacaoController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PontuacaoModule-e3945936dbf0c00132aa5a8d4d9fa9378653b7538087aa6ed61fa5759ab4435f5ca040aca92a94fe3866506270b1cf1b8a5bb9e995ae48c9db1a13428b3b3fe9"' : 'data-target="#xs-injectables-links-module-PontuacaoModule-e3945936dbf0c00132aa5a8d4d9fa9378653b7538087aa6ed61fa5759ab4435f5ca040aca92a94fe3866506270b1cf1b8a5bb9e995ae48c9db1a13428b3b3fe9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PontuacaoModule-e3945936dbf0c00132aa5a8d4d9fa9378653b7538087aa6ed61fa5759ab4435f5ca040aca92a94fe3866506270b1cf1b8a5bb9e995ae48c9db1a13428b3b3fe9"' :
                                        'id="xs-injectables-links-module-PontuacaoModule-e3945936dbf0c00132aa5a8d4d9fa9378653b7538087aa6ed61fa5759ab4435f5ca040aca92a94fe3866506270b1cf1b8a5bb9e995ae48c9db1a13428b3b3fe9"' }>
                                        <li class="link">
                                            <a href="injectables/AplicaRegraDesempateService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AplicaRegraDesempateService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PontuacaoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PontuacaoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RegistraDesistenciaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistraDesistenciaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RegistraResultadoPartidaFacade.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistraResultadoPartidaFacade</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SmsModule.html" data-type="entity-link" >SmsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SmsModule-fe510673eb77b8c8f26f423b37922ef467f7947292694d0040de39ae5af986b5e9d99f7db0febefb3eaa419b433db1ee31abab55c71b6889bf5cbc9ad399ebc2"' : 'data-target="#xs-injectables-links-module-SmsModule-fe510673eb77b8c8f26f423b37922ef467f7947292694d0040de39ae5af986b5e9d99f7db0febefb3eaa419b433db1ee31abab55c71b6889bf5cbc9ad399ebc2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SmsModule-fe510673eb77b8c8f26f423b37922ef467f7947292694d0040de39ae5af986b5e9d99f7db0febefb3eaa419b433db1ee31abab55c71b6889bf5cbc9ad399ebc2"' :
                                        'id="xs-injectables-links-module-SmsModule-fe510673eb77b8c8f26f423b37922ef467f7947292694d0040de39ae5af986b5e9d99f7db0febefb3eaa419b433db1ee31abab55c71b6889bf5cbc9ad399ebc2"' }>
                                        <li class="link">
                                            <a href="injectables/EnviaVerificacaoSmsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EnviaVerificacaoSmsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VerificaCodigoSmsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerificaCodigoSmsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ArbitroController.html" data-type="entity-link" >ArbitroController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AtletaController.html" data-type="entity-link" >AtletaController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuxiliarController.html" data-type="entity-link" >AuxiliarController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CraqueDaGaleraController.html" data-type="entity-link" >CraqueDaGaleraController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DelegadoController.html" data-type="entity-link" >DelegadoController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/EquipeController.html" data-type="entity-link" >EquipeController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/FundamentoAtletaController.html" data-type="entity-link" >FundamentoAtletaController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/GinasioController.html" data-type="entity-link" >GinasioController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/LigaController.html" data-type="entity-link" >LigaController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MelhorCentralController.html" data-type="entity-link" >MelhorCentralController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MelhorLiberoController.html" data-type="entity-link" >MelhorLiberoController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MelhorOpostoController.html" data-type="entity-link" >MelhorOpostoController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PartidaController.html" data-type="entity-link" >PartidaController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PontuacaoController.html" data-type="entity-link" >PontuacaoController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TecnicoController.html" data-type="entity-link" >TecnicoController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/VotoDaGaleraController.html" data-type="entity-link" >VotoDaGaleraController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Arbitro.html" data-type="entity-link" >Arbitro</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ArbitroPartida.html" data-type="entity-link" >ArbitroPartida</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Atleta.html" data-type="entity-link" >Atleta</a>
                                </li>
                                <li class="link">
                                    <a href="entities/AtletaEscalado.html" data-type="entity-link" >AtletaEscalado</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Auxiliar.html" data-type="entity-link" >Auxiliar</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Delegado.html" data-type="entity-link" >Delegado</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Equipe.html" data-type="entity-link" >Equipe</a>
                                </li>
                                <li class="link">
                                    <a href="entities/EquipePartida.html" data-type="entity-link" >EquipePartida</a>
                                </li>
                                <li class="link">
                                    <a href="entities/FundamentoAtleta.html" data-type="entity-link" >FundamentoAtleta</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Ginasio.html" data-type="entity-link" >Ginasio</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Liga.html" data-type="entity-link" >Liga</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Partida.html" data-type="entity-link" >Partida</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Pessoa.html" data-type="entity-link" >Pessoa</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Tecnico.html" data-type="entity-link" >Tecnico</a>
                                </li>
                                <li class="link">
                                    <a href="entities/VotoDaGalera.html" data-type="entity-link" >VotoDaGalera</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AdicionaCapacidade1653516334163.html" data-type="entity-link" >AdicionaCapacidade1653516334163</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdicionaCidadeSedeAEquipe1653302297857.html" data-type="entity-link" >AdicionaCidadeSedeAEquipe1653302297857</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdicionaMaisInfosPontuacaoEquipe1654351254628.html" data-type="entity-link" >AdicionaMaisInfosPontuacaoEquipe1654351254628</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdicionaNumeroDaRodadaNaPartida1653791739397.html" data-type="entity-link" >AdicionaNumeroDaRodadaNaPartida1653791739397</a>
                            </li>
                            <li class="link">
                                <a href="classes/AjustaRelacoes1653437242729.html" data-type="entity-link" >AjustaRelacoes1653437242729</a>
                            </li>
                            <li class="link">
                                <a href="classes/AlteraLigaEntity1653393427061.html" data-type="entity-link" >AlteraLigaEntity1653393427061</a>
                            </li>
                            <li class="link">
                                <a href="classes/AlteraPartidaEntity1653391232553.html" data-type="entity-link" >AlteraPartidaEntity1653391232553</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnoPelaComeçoData1653524729987.html" data-type="entity-link" >AnoPelaComeçoData1653524729987</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArbitroPartida.html" data-type="entity-link" >ArbitroPartida</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArbitroPartidaAtualizaEnumTipoArbitro1656090457531.html" data-type="entity-link" >ArbitroPartidaAtualizaEnumTipoArbitro1656090457531</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArbitroPartidaDto.html" data-type="entity-link" >ArbitroPartidaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArbitroPartidaRepository.html" data-type="entity-link" >ArbitroPartidaRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArbitroRepository.html" data-type="entity-link" >ArbitroRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArbitroRespostaDto.html" data-type="entity-link" >ArbitroRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArbitroServer.html" data-type="entity-link" >ArbitroServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/Atleta.html" data-type="entity-link" >Atleta</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtletaComEquipeRespostaDto.html" data-type="entity-link" >AtletaComEquipeRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtletaEscalado.html" data-type="entity-link" >AtletaEscalado</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtletaEscaladoComPerfilAtletaRespostaDto.html" data-type="entity-link" >AtletaEscaladoComPerfilAtletaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtletaEscaladoRepository.html" data-type="entity-link" >AtletaEscaladoRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtletaEscaladoRespostaDto.html" data-type="entity-link" >AtletaEscaladoRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtletaEscaladoSimplesRespostaDto.html" data-type="entity-link" >AtletaEscaladoSimplesRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtletaParticipacaoDto.html" data-type="entity-link" >AtletaParticipacaoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtletaRepository.html" data-type="entity-link" >AtletaRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtletaRespostaDto.html" data-type="entity-link" >AtletaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtletaServer.html" data-type="entity-link" >AtletaServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtualizaAtletaDto.html" data-type="entity-link" >AtualizaAtletaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtualizaEquipeDto.html" data-type="entity-link" >AtualizaEquipeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtualizaPartidaStatusDto.html" data-type="entity-link" >AtualizaPartidaStatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtualizaPessoaDto.html" data-type="entity-link" >AtualizaPessoaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuxiliarRepository.html" data-type="entity-link" >AuxiliarRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuxiliarRespostaDto.html" data-type="entity-link" >AuxiliarRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuxiliarServer.html" data-type="entity-link" >AuxiliarServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/CadastrarParticipantesPartidaDto.html" data-type="entity-link" >CadastrarParticipantesPartidaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CadastrarResultadoPartidaDto.html" data-type="entity-link" >CadastrarResultadoPartidaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CascadeAll1655171226824.html" data-type="entity-link" >CascadeAll1655171226824</a>
                            </li>
                            <li class="link">
                                <a href="classes/CascadeAll21655208308702.html" data-type="entity-link" >CascadeAll21655208308702</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfirmarVotoDto.html" data-type="entity-link" >ConfirmarVotoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CraqueDaGaleraRespostaDto.html" data-type="entity-link" >CraqueDaGaleraRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CraqueDaGaleraView.html" data-type="entity-link" >CraqueDaGaleraView</a>
                            </li>
                            <li class="link">
                                <a href="classes/CraqueDaGaleraViewRepository.html" data-type="entity-link" >CraqueDaGaleraViewRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaArbitroDto.html" data-type="entity-link" >CriaArbitroDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaArbitroEDelegado1653304126875.html" data-type="entity-link" >CriaArbitroEDelegado1653304126875</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaAtletaDto.html" data-type="entity-link" >CriaAtletaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaAuxiliar1653436336972.html" data-type="entity-link" >CriaAuxiliar1653436336972</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaAuxiliarDto.html" data-type="entity-link" >CriaAuxiliarDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaCraqueDaGaleraView1654858740252.html" data-type="entity-link" >CriaCraqueDaGaleraView1654858740252</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaDelegadoDto.html" data-type="entity-link" >CriaDelegadoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaEquipeDto.html" data-type="entity-link" >CriaEquipeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaFundamentoAtletaDto.html" data-type="entity-link" >CriaFundamentoAtletaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaFundamentoAtletaEIndicePartidaStatus1654524370115.html" data-type="entity-link" >CriaFundamentoAtletaEIndicePartidaStatus1654524370115</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaGinasio1653265198722.html" data-type="entity-link" >CriaGinasio1653265198722</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaGinasioDto.html" data-type="entity-link" >CriaGinasioDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaIndiceEmIdEquipe1653301746629.html" data-type="entity-link" >CriaIndiceEmIdEquipe1653301746629</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaLiga1652972713631.html" data-type="entity-link" >CriaLiga1652972713631</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaLigaDto.html" data-type="entity-link" >CriaLigaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaMelhorCentralView1654692169345.html" data-type="entity-link" >CriaMelhorCentralView1654692169345</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaMelhorLiberoView1654530011934.html" data-type="entity-link" >CriaMelhorLiberoView1654530011934</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaMelhorPontaView1654795843306.html" data-type="entity-link" >CriaMelhorPontaView1654795843306</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaPartida1653348797091.html" data-type="entity-link" >CriaPartida1653348797091</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaPartida1653868400725.html" data-type="entity-link" >CriaPartida1653868400725</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaPessoaDto.html" data-type="entity-link" >CriaPessoaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaPontuacaoEquipe1654343225119.html" data-type="entity-link" >CriaPontuacaoEquipe1654343225119</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaPontuacaoPartida1653869981185.html" data-type="entity-link" >CriaPontuacaoPartida1653869981185</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaPontuacoesView1654597372424.html" data-type="entity-link" >CriaPontuacoesView1654597372424</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaTecnicoDto.html" data-type="entity-link" >CriaTecnicoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaVotoDaGalera1654857614503.html" data-type="entity-link" >CriaVotoDaGalera1654857614503</a>
                            </li>
                            <li class="link">
                                <a href="classes/DelegadoRepository.html" data-type="entity-link" >DelegadoRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/DelegadoRespostaDto.html" data-type="entity-link" >DelegadoRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DelegadoServer.html" data-type="entity-link" >DelegadoServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeveListarAtletasDto.html" data-type="entity-link" >DeveListarAtletasDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DropTabelasNUsadas1654696649353.html" data-type="entity-link" >DropTabelasNUsadas1654696649353</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditaMelhorLiberoView1654600637313.html" data-type="entity-link" >EditaMelhorLiberoView1654600637313</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntidadeBase.html" data-type="entity-link" >EntidadeBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/Equipe.html" data-type="entity-link" >Equipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipeAdicionaIdxIdLiga1655655121730.html" data-type="entity-link" >EquipeAdicionaIdxIdLiga1655655121730</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipeAptaServer.html" data-type="entity-link" >EquipeAptaServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipePartidaCircularDep1655328926296.html" data-type="entity-link" >EquipePartidaCircularDep1655328926296</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipePartidaRepository.html" data-type="entity-link" >EquipePartidaRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipePartidaRespostaDto.html" data-type="entity-link" >EquipePartidaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipePartidaRespostaDto-1.html" data-type="entity-link" >EquipePartidaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipePartidasAjustaRelacionamento1654696771004.html" data-type="entity-link" >EquipePartidasAjustaRelacionamento1654696771004</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipeRepository.html" data-type="entity-link" >EquipeRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipeRespostaDto.html" data-type="entity-link" >EquipeRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipeServer.html" data-type="entity-link" >EquipeServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipeSimplificadaRespostaDto.html" data-type="entity-link" >EquipeSimplificadaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EstadoLiga1654349284480.html" data-type="entity-link" >EstadoLiga1654349284480</a>
                            </li>
                            <li class="link">
                                <a href="classes/EstatisticaMediaPorPartidaENaoAbsoluta1654794767125.html" data-type="entity-link" >EstatisticaMediaPorPartidaENaoAbsoluta1654794767125</a>
                            </li>
                            <li class="link">
                                <a href="classes/EstatisticaViewFiltraPosicaoDoAtletaEscalado1654787068806.html" data-type="entity-link" >EstatisticaViewFiltraPosicaoDoAtletaEscalado1654787068806</a>
                            </li>
                            <li class="link">
                                <a href="classes/FinalLigaRespostaDto.html" data-type="entity-link" >FinalLigaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundamentoAgregadoAtletaRespostaDto.html" data-type="entity-link" >FundamentoAgregadoAtletaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundamentoAtletaAdicionaLevantamento1656339610210.html" data-type="entity-link" >FundamentoAtletaAdicionaLevantamento1656339610210</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundamentoAtletaRepository.html" data-type="entity-link" >FundamentoAtletaRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundamentoAtletaRespostaDto.html" data-type="entity-link" >FundamentoAtletaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundamentoAtletaServer.html" data-type="entity-link" >FundamentoAtletaServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeraPartidasLigaRespostaDto.html" data-type="entity-link" >GeraPartidasLigaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Ginasio.html" data-type="entity-link" >Ginasio</a>
                            </li>
                            <li class="link">
                                <a href="classes/GinasioRepository.html" data-type="entity-link" >GinasioRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/GinasioRespostaDto.html" data-type="entity-link" >GinasioRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GinasioServer.html" data-type="entity-link" >GinasioServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrafoDeConfronto.html" data-type="entity-link" >GrafoDeConfronto</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link" >HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/InicializaFinalDto.html" data-type="entity-link" >InicializaFinalDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InicializaLigaDto.html" data-type="entity-link" >InicializaLigaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InicializaLigaRespostaDto.html" data-type="entity-link" >InicializaLigaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InicializaQuartaDeFinalDto.html" data-type="entity-link" >InicializaQuartaDeFinalDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InicializaSemifinalDto.html" data-type="entity-link" >InicializaSemifinalDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IniciarVotoDto.html" data-type="entity-link" >IniciarVotoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IniciarVotoRespostaDto.html" data-type="entity-link" >IniciarVotoRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LigaFinaisServer.html" data-type="entity-link" >LigaFinaisServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/LigaIniciadaServer.html" data-type="entity-link" >LigaIniciadaServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/LigaQuartasDeFinalServer.html" data-type="entity-link" >LigaQuartasDeFinalServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/LigaRenomeiaEstadoParaStatus1654366866798.html" data-type="entity-link" >LigaRenomeiaEstadoParaStatus1654366866798</a>
                            </li>
                            <li class="link">
                                <a href="classes/LigaRepository.html" data-type="entity-link" >LigaRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/LigaRespostaDto.html" data-type="entity-link" >LigaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LigaServer.html" data-type="entity-link" >LigaServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/LigaStatusRenomeado1654398829604.html" data-type="entity-link" >LigaStatusRenomeado1654398829604</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListaArbitroDto.html" data-type="entity-link" >ListaArbitroDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListaAtletaDto.html" data-type="entity-link" >ListaAtletaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListaAuxiliarDto.html" data-type="entity-link" >ListaAuxiliarDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListaDelegadoDto.html" data-type="entity-link" >ListaDelegadoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListaEquipesDto.html" data-type="entity-link" >ListaEquipesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListaFundamentoNaLigaDto.html" data-type="entity-link" >ListaFundamentoNaLigaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListaGinasiosDto.html" data-type="entity-link" >ListaGinasiosDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListaPartidasDto.html" data-type="entity-link" >ListaPartidasDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MataMataGeneratorService.html" data-type="entity-link" >MataMataGeneratorService</a>
                            </li>
                            <li class="link">
                                <a href="classes/MaterializedViewRepository.html" data-type="entity-link" >MaterializedViewRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/MelhorCentralRespostaDto.html" data-type="entity-link" >MelhorCentralRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MelhorCentralView.html" data-type="entity-link" >MelhorCentralView</a>
                            </li>
                            <li class="link">
                                <a href="classes/MelhorCentralViewRepository.html" data-type="entity-link" >MelhorCentralViewRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/MelhoresOpostosView1656339920419.html" data-type="entity-link" >MelhoresOpostosView1656339920419</a>
                            </li>
                            <li class="link">
                                <a href="classes/MelhorLiberoRespostaDto.html" data-type="entity-link" >MelhorLiberoRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MelhorLiberoView.html" data-type="entity-link" >MelhorLiberoView</a>
                            </li>
                            <li class="link">
                                <a href="classes/MelhorLiberoViewRepository.html" data-type="entity-link" >MelhorLiberoViewRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/MelhorOpostoView.html" data-type="entity-link" >MelhorOpostoView</a>
                            </li>
                            <li class="link">
                                <a href="classes/MelhorOpostoViewRepository.html" data-type="entity-link" >MelhorOpostoViewRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/MelhorPontaRespostaDto.html" data-type="entity-link" >MelhorPontaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MelhorPosicaoRespostaDto.html" data-type="entity-link" >MelhorPosicaoRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MelhorPosicaoViewRepository.html" data-type="entity-link" >MelhorPosicaoViewRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/Partida.html" data-type="entity-link" >Partida</a>
                            </li>
                            <li class="link">
                                <a href="classes/PartidaAdicionaIndiceParaRemoverSemVencedores1654398877055.html" data-type="entity-link" >PartidaAdicionaIndiceParaRemoverSemVencedores1654398877055</a>
                            </li>
                            <li class="link">
                                <a href="classes/PartidaAlteraTipagemTipoRodada1654450848783.html" data-type="entity-link" >PartidaAlteraTipagemTipoRodada1654450848783</a>
                            </li>
                            <li class="link">
                                <a href="classes/PartidaConcluidaServer.html" data-type="entity-link" >PartidaConcluidaServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/PartidaCriaIndiceSemVencedores1654600953647.html" data-type="entity-link" >PartidaCriaIndiceSemVencedores1654600953647</a>
                            </li>
                            <li class="link">
                                <a href="classes/PartidaRenomeiaFkEquipeGanhadora1654355572210.html" data-type="entity-link" >PartidaRenomeiaFkEquipeGanhadora1654355572210</a>
                            </li>
                            <li class="link">
                                <a href="classes/PartidaRepository.html" data-type="entity-link" >PartidaRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/PartidaRespostaDto.html" data-type="entity-link" >PartidaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PartidaServer.html" data-type="entity-link" >PartidaServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/PessoaDeEquipe.html" data-type="entity-link" >PessoaDeEquipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/PessoaDeLiga.html" data-type="entity-link" >PessoaDeLiga</a>
                            </li>
                            <li class="link">
                                <a href="classes/PessoaRespostaDto.html" data-type="entity-link" >PessoaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PontuacaoDto.html" data-type="entity-link" >PontuacaoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PontuacaoRespostaDto.html" data-type="entity-link" >PontuacaoRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PontuacaoServer.html" data-type="entity-link" >PontuacaoServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/PontuacaoView.html" data-type="entity-link" >PontuacaoView</a>
                            </li>
                            <li class="link">
                                <a href="classes/PontuacaoViewAjustaQuery1655760085847.html" data-type="entity-link" >PontuacaoViewAjustaQuery1655760085847</a>
                            </li>
                            <li class="link">
                                <a href="classes/PontuacaoViewApenasClassificatoria1657305148173.html" data-type="entity-link" >PontuacaoViewApenasClassificatoria1657305148173</a>
                            </li>
                            <li class="link">
                                <a href="classes/PontuacaoViewRepository.html" data-type="entity-link" >PontuacaoViewRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuartaDeFinalDto.html" data-type="entity-link" >QuartaDeFinalDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuartasLigaRespostaDto.html" data-type="entity-link" >QuartasLigaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemarcarPartidaDto.html" data-type="entity-link" >RemarcarPartidaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SalvaConfiguracaoInicializacaoLiga1653758156139.html" data-type="entity-link" >SalvaConfiguracaoInicializacaoLiga1653758156139</a>
                            </li>
                            <li class="link">
                                <a href="classes/SemisEFinalGeneratorService.html" data-type="entity-link" >SemisEFinalGeneratorService</a>
                            </li>
                            <li class="link">
                                <a href="classes/SemisLigaRespostaDto.html" data-type="entity-link" >SemisLigaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SnapshotER1652931746184.html" data-type="entity-link" >SnapshotER1652931746184</a>
                            </li>
                            <li class="link">
                                <a href="classes/TecnicoRepository.html" data-type="entity-link" >TecnicoRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/TecnicoRespostaDto.html" data-type="entity-link" >TecnicoRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TecnicoServer.html" data-type="entity-link" >TecnicoServer</a>
                            </li>
                            <li class="link">
                                <a href="classes/TemPessoa.html" data-type="entity-link" >TemPessoa</a>
                            </li>
                            <li class="link">
                                <a href="classes/TypeOrmExModule.html" data-type="entity-link" >TypeOrmExModule</a>
                            </li>
                            <li class="link">
                                <a href="classes/VotoDaGalera.html" data-type="entity-link" >VotoDaGalera</a>
                            </li>
                            <li class="link">
                                <a href="classes/VotoDaGaleraRepository.html" data-type="entity-link" >VotoDaGaleraRepository</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AplicaRegraDesempateService.html" data-type="entity-link" >AplicaRegraDesempateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ArbitroService.html" data-type="entity-link" >ArbitroService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AtletaEscaladoService.html" data-type="entity-link" >AtletaEscaladoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AtletaService.html" data-type="entity-link" >AtletaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuxiliarService.html" data-type="entity-link" >AuxiliarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClassificacaoGeneratorService.html" data-type="entity-link" >ClassificacaoGeneratorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CraqueDaGaleraService.html" data-type="entity-link" >CraqueDaGaleraService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DelegadoService.html" data-type="entity-link" >DelegadoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EnviaVerificacaoSmsService.html" data-type="entity-link" >EnviaVerificacaoSmsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EquipeService.html" data-type="entity-link" >EquipeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FinalGeneratorService.html" data-type="entity-link" >FinalGeneratorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FundamentoAtletaService.html" data-type="entity-link" >FundamentoAtletaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GinasioService.html" data-type="entity-link" >GinasioService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LigaService.html" data-type="entity-link" >LigaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MelhorCentralService.html" data-type="entity-link" >MelhorCentralService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MelhorLiberoService.html" data-type="entity-link" >MelhorLiberoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MelhorOpostoService.html" data-type="entity-link" >MelhorOpostoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PartidaFactory.html" data-type="entity-link" >PartidaFactory</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PartidaService.html" data-type="entity-link" >PartidaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PontuacaoService.html" data-type="entity-link" >PontuacaoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuartaDeFinalGeneratorService.html" data-type="entity-link" >QuartaDeFinalGeneratorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RegistraDesistenciaService.html" data-type="entity-link" >RegistraDesistenciaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RegistraResultadoPartidaFacade.html" data-type="entity-link" >RegistraResultadoPartidaFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SalvaPartidaFacade.html" data-type="entity-link" >SalvaPartidaFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SemifinalGeneratorService.html" data-type="entity-link" >SemifinalGeneratorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TecnicoService.html" data-type="entity-link" >TecnicoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TypeORMFilterService.html" data-type="entity-link" >TypeORMFilterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VerificaCodigoSmsService.html" data-type="entity-link" >VerificaCodigoSmsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VerificaUrlService.html" data-type="entity-link" >VerificaUrlService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VotoDaGaleraService.html" data-type="entity-link" >VotoDaGaleraService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AppConfig.html" data-type="entity-link" >AppConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAplicaRegraDesempateDto.html" data-type="entity-link" >IAplicaRegraDesempateDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBuscaAtletaEscalado.html" data-type="entity-link" >IBuscaAtletaEscalado</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBuscaQuantidadePartidasPorTipoEStatus.html" data-type="entity-link" >IBuscaQuantidadePartidasPorTipoEStatus</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBuscarConfrontoEquipesEmpatadas.html" data-type="entity-link" >IBuscarConfrontoEquipesEmpatadas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IClassificacaoGeneratorRequest.html" data-type="entity-link" >IClassificacaoGeneratorRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IClassificados.html" data-type="entity-link" >IClassificados</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IClassValidatorException.html" data-type="entity-link" >IClassValidatorException</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConfiguraInicializaoLiga.html" data-type="entity-link" >IConfiguraInicializaoLiga</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDeterminaPontuacaoNumeroDeSets.html" data-type="entity-link" >IDeterminaPontuacaoNumeroDeSets</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEnviaVerificacaoSmsResposta.html" data-type="entity-link" >IEnviaVerificacaoSmsResposta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IException.html" data-type="entity-link" >IException</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFundamentoAtletaLiga.html" data-type="entity-link" >IFundamentoAtletaLiga</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInfoRodada.html" data-type="entity-link" >IInfoRodada</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInicializaFinais.html" data-type="entity-link" >IInicializaFinais</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInicializaLigaDto.html" data-type="entity-link" >IInicializaLigaDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMataMataDto.html" data-type="entity-link" >IMataMataDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMelhorEstatisticaService.html" data-type="entity-link" >IMelhorEstatisticaService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPartidaFactoryDto.html" data-type="entity-link" >IPartidaFactoryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPontoNoSet.html" data-type="entity-link" >IPontoNoSet</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPontuacaoPartidaDto.html" data-type="entity-link" >IPontuacaoPartidaDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRateLimitConfig.html" data-type="entity-link" >IRateLimitConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRegistraDesistenciaDto.html" data-type="entity-link" >IRegistraDesistenciaDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRegistraEquipeGanhadoraDto.html" data-type="entity-link" >IRegistraEquipeGanhadoraDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITypeORMFilterRequest.html" data-type="entity-link" >ITypeORMFilterRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IValidaNumeroEquipeDto.html" data-type="entity-link" >IValidaNumeroEquipeDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListaPartidasRepositoryDto.html" data-type="entity-link" >ListaPartidasRepositoryDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});