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
                    <a href="index.html" data-type="index-link">Voleibol</a>
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
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link" >CoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-be65ee28a322d9c82e07c3afb8ebca0b3897801122b2985420a733eb55fc0ef038e3322e5ae2d4bf0f22596bac0dd4890df07f99b71cdde6c348e1ae6bfce5de"' : 'data-target="#xs-injectables-links-module-CoreModule-be65ee28a322d9c82e07c3afb8ebca0b3897801122b2985420a733eb55fc0ef038e3322e5ae2d4bf0f22596bac0dd4890df07f99b71cdde6c348e1ae6bfce5de"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-be65ee28a322d9c82e07c3afb8ebca0b3897801122b2985420a733eb55fc0ef038e3322e5ae2d4bf0f22596bac0dd4890df07f99b71cdde6c348e1ae6bfce5de"' :
                                        'id="xs-injectables-links-module-CoreModule-be65ee28a322d9c82e07c3afb8ebca0b3897801122b2985420a733eb55fc0ef038e3322e5ae2d4bf0f22596bac0dd4890df07f99b71cdde6c348e1ae6bfce5de"' }>
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
                                            'data-target="#controllers-links-module-EquipeModule-fcc1c43d7a16c0344ccf37f14866ee592abecc28fc18e5c281fac0e5deaa35ec511be8ce47b3bce6041764ee47f9a68a0d223d81fcf27a2146898b479a6d5f14"' : 'data-target="#xs-controllers-links-module-EquipeModule-fcc1c43d7a16c0344ccf37f14866ee592abecc28fc18e5c281fac0e5deaa35ec511be8ce47b3bce6041764ee47f9a68a0d223d81fcf27a2146898b479a6d5f14"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EquipeModule-fcc1c43d7a16c0344ccf37f14866ee592abecc28fc18e5c281fac0e5deaa35ec511be8ce47b3bce6041764ee47f9a68a0d223d81fcf27a2146898b479a6d5f14"' :
                                            'id="xs-controllers-links-module-EquipeModule-fcc1c43d7a16c0344ccf37f14866ee592abecc28fc18e5c281fac0e5deaa35ec511be8ce47b3bce6041764ee47f9a68a0d223d81fcf27a2146898b479a6d5f14"' }>
                                            <li class="link">
                                                <a href="controllers/EquipeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EquipeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EquipeModule-fcc1c43d7a16c0344ccf37f14866ee592abecc28fc18e5c281fac0e5deaa35ec511be8ce47b3bce6041764ee47f9a68a0d223d81fcf27a2146898b479a6d5f14"' : 'data-target="#xs-injectables-links-module-EquipeModule-fcc1c43d7a16c0344ccf37f14866ee592abecc28fc18e5c281fac0e5deaa35ec511be8ce47b3bce6041764ee47f9a68a0d223d81fcf27a2146898b479a6d5f14"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EquipeModule-fcc1c43d7a16c0344ccf37f14866ee592abecc28fc18e5c281fac0e5deaa35ec511be8ce47b3bce6041764ee47f9a68a0d223d81fcf27a2146898b479a6d5f14"' :
                                        'id="xs-injectables-links-module-EquipeModule-fcc1c43d7a16c0344ccf37f14866ee592abecc28fc18e5c281fac0e5deaa35ec511be8ce47b3bce6041764ee47f9a68a0d223d81fcf27a2146898b479a6d5f14"' }>
                                        <li class="link">
                                            <a href="injectables/EquipeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EquipeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GinasioModule.html" data-type="entity-link" >GinasioModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-GinasioModule-00ffb9871cb860f94977dab13a4df941826b8894c4b4fdc5082e278dbbb4aefed7dae91d284d8e6e360974c1bc903f097a14437d4777be4d69b54e2c80ef0a4f"' : 'data-target="#xs-controllers-links-module-GinasioModule-00ffb9871cb860f94977dab13a4df941826b8894c4b4fdc5082e278dbbb4aefed7dae91d284d8e6e360974c1bc903f097a14437d4777be4d69b54e2c80ef0a4f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GinasioModule-00ffb9871cb860f94977dab13a4df941826b8894c4b4fdc5082e278dbbb4aefed7dae91d284d8e6e360974c1bc903f097a14437d4777be4d69b54e2c80ef0a4f"' :
                                            'id="xs-controllers-links-module-GinasioModule-00ffb9871cb860f94977dab13a4df941826b8894c4b4fdc5082e278dbbb4aefed7dae91d284d8e6e360974c1bc903f097a14437d4777be4d69b54e2c80ef0a4f"' }>
                                            <li class="link">
                                                <a href="controllers/GinasioController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GinasioController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-GinasioModule-00ffb9871cb860f94977dab13a4df941826b8894c4b4fdc5082e278dbbb4aefed7dae91d284d8e6e360974c1bc903f097a14437d4777be4d69b54e2c80ef0a4f"' : 'data-target="#xs-injectables-links-module-GinasioModule-00ffb9871cb860f94977dab13a4df941826b8894c4b4fdc5082e278dbbb4aefed7dae91d284d8e6e360974c1bc903f097a14437d4777be4d69b54e2c80ef0a4f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GinasioModule-00ffb9871cb860f94977dab13a4df941826b8894c4b4fdc5082e278dbbb4aefed7dae91d284d8e6e360974c1bc903f097a14437d4777be4d69b54e2c80ef0a4f"' :
                                        'id="xs-injectables-links-module-GinasioModule-00ffb9871cb860f94977dab13a4df941826b8894c4b4fdc5082e278dbbb4aefed7dae91d284d8e6e360974c1bc903f097a14437d4777be4d69b54e2c80ef0a4f"' }>
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
                                            'data-target="#controllers-links-module-LigaModule-87c0a1b6299b8774391c6dbcec907c684ef4cfdfb7bb400a8c1c4fe76f4049e413f62282e4ac10d096689663adb8af10c1b27ebab43f2a401a28ae92c765106e"' : 'data-target="#xs-controllers-links-module-LigaModule-87c0a1b6299b8774391c6dbcec907c684ef4cfdfb7bb400a8c1c4fe76f4049e413f62282e4ac10d096689663adb8af10c1b27ebab43f2a401a28ae92c765106e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LigaModule-87c0a1b6299b8774391c6dbcec907c684ef4cfdfb7bb400a8c1c4fe76f4049e413f62282e4ac10d096689663adb8af10c1b27ebab43f2a401a28ae92c765106e"' :
                                            'id="xs-controllers-links-module-LigaModule-87c0a1b6299b8774391c6dbcec907c684ef4cfdfb7bb400a8c1c4fe76f4049e413f62282e4ac10d096689663adb8af10c1b27ebab43f2a401a28ae92c765106e"' }>
                                            <li class="link">
                                                <a href="controllers/LigaController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LigaController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LigaModule-87c0a1b6299b8774391c6dbcec907c684ef4cfdfb7bb400a8c1c4fe76f4049e413f62282e4ac10d096689663adb8af10c1b27ebab43f2a401a28ae92c765106e"' : 'data-target="#xs-injectables-links-module-LigaModule-87c0a1b6299b8774391c6dbcec907c684ef4cfdfb7bb400a8c1c4fe76f4049e413f62282e4ac10d096689663adb8af10c1b27ebab43f2a401a28ae92c765106e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LigaModule-87c0a1b6299b8774391c6dbcec907c684ef4cfdfb7bb400a8c1c4fe76f4049e413f62282e4ac10d096689663adb8af10c1b27ebab43f2a401a28ae92c765106e"' :
                                        'id="xs-injectables-links-module-LigaModule-87c0a1b6299b8774391c6dbcec907c684ef4cfdfb7bb400a8c1c4fe76f4049e413f62282e4ac10d096689663adb8af10c1b27ebab43f2a401a28ae92c765106e"' }>
                                        <li class="link">
                                            <a href="injectables/LigaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LigaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PartidaModule.html" data-type="entity-link" >PartidaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PartidaModule-abe104c96d17e284c044bda7969500c4c9e0f13eefa4dbba7b3a7d4983d63e07bee8a4b0e451b445bec7c1ff6b8ff36779e4e32988389f5a6d22ddc4c87c48c2"' : 'data-target="#xs-controllers-links-module-PartidaModule-abe104c96d17e284c044bda7969500c4c9e0f13eefa4dbba7b3a7d4983d63e07bee8a4b0e451b445bec7c1ff6b8ff36779e4e32988389f5a6d22ddc4c87c48c2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PartidaModule-abe104c96d17e284c044bda7969500c4c9e0f13eefa4dbba7b3a7d4983d63e07bee8a4b0e451b445bec7c1ff6b8ff36779e4e32988389f5a6d22ddc4c87c48c2"' :
                                            'id="xs-controllers-links-module-PartidaModule-abe104c96d17e284c044bda7969500c4c9e0f13eefa4dbba7b3a7d4983d63e07bee8a4b0e451b445bec7c1ff6b8ff36779e4e32988389f5a6d22ddc4c87c48c2"' }>
                                            <li class="link">
                                                <a href="controllers/PartidaController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PartidaController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PartidaModule-abe104c96d17e284c044bda7969500c4c9e0f13eefa4dbba7b3a7d4983d63e07bee8a4b0e451b445bec7c1ff6b8ff36779e4e32988389f5a6d22ddc4c87c48c2"' : 'data-target="#xs-injectables-links-module-PartidaModule-abe104c96d17e284c044bda7969500c4c9e0f13eefa4dbba7b3a7d4983d63e07bee8a4b0e451b445bec7c1ff6b8ff36779e4e32988389f5a6d22ddc4c87c48c2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PartidaModule-abe104c96d17e284c044bda7969500c4c9e0f13eefa4dbba7b3a7d4983d63e07bee8a4b0e451b445bec7c1ff6b8ff36779e4e32988389f5a6d22ddc4c87c48c2"' :
                                        'id="xs-injectables-links-module-PartidaModule-abe104c96d17e284c044bda7969500c4c9e0f13eefa4dbba7b3a7d4983d63e07bee8a4b0e451b445bec7c1ff6b8ff36779e4e32988389f5a6d22ddc4c87c48c2"' }>
                                        <li class="link">
                                            <a href="injectables/PartidaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PartidaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PessoaModule.html" data-type="entity-link" >PessoaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PessoaModule-c72c48cef5bba5f1658c8db38988f197df13a51aafd442ab6317984698c5df8308e6e00610d64f7c3bf00e2b8bae267926af1bd10b2152a49f030b859ae5beb8"' : 'data-target="#xs-controllers-links-module-PessoaModule-c72c48cef5bba5f1658c8db38988f197df13a51aafd442ab6317984698c5df8308e6e00610d64f7c3bf00e2b8bae267926af1bd10b2152a49f030b859ae5beb8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PessoaModule-c72c48cef5bba5f1658c8db38988f197df13a51aafd442ab6317984698c5df8308e6e00610d64f7c3bf00e2b8bae267926af1bd10b2152a49f030b859ae5beb8"' :
                                            'id="xs-controllers-links-module-PessoaModule-c72c48cef5bba5f1658c8db38988f197df13a51aafd442ab6317984698c5df8308e6e00610d64f7c3bf00e2b8bae267926af1bd10b2152a49f030b859ae5beb8"' }>
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
                                        'data-target="#injectables-links-module-PessoaModule-c72c48cef5bba5f1658c8db38988f197df13a51aafd442ab6317984698c5df8308e6e00610d64f7c3bf00e2b8bae267926af1bd10b2152a49f030b859ae5beb8"' : 'data-target="#xs-injectables-links-module-PessoaModule-c72c48cef5bba5f1658c8db38988f197df13a51aafd442ab6317984698c5df8308e6e00610d64f7c3bf00e2b8bae267926af1bd10b2152a49f030b859ae5beb8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PessoaModule-c72c48cef5bba5f1658c8db38988f197df13a51aafd442ab6317984698c5df8308e6e00610d64f7c3bf00e2b8bae267926af1bd10b2152a49f030b859ae5beb8"' :
                                        'id="xs-injectables-links-module-PessoaModule-c72c48cef5bba5f1658c8db38988f197df13a51aafd442ab6317984698c5df8308e6e00610d64f7c3bf00e2b8bae267926af1bd10b2152a49f030b859ae5beb8"' }>
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
                                    <a href="entities/Atleta.html" data-type="entity-link" >Atleta</a>
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
                                <a href="classes/ArbitroRepository.html" data-type="entity-link" >ArbitroRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArbitroRespostaDto.html" data-type="entity-link" >ArbitroRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Atleta.html" data-type="entity-link" >Atleta</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtletaRepository.html" data-type="entity-link" >AtletaRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/AtletaRespostaDto.html" data-type="entity-link" >AtletaRespostaDto</a>
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
                                <a href="classes/AuxiliarRepository.html" data-type="entity-link" >AuxiliarRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuxiliarRespostaDto.html" data-type="entity-link" >AuxiliarRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClassificacaoGenerator.html" data-type="entity-link" >ClassificacaoGenerator</a>
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
                                <a href="classes/CriaDelegadoDto.html" data-type="entity-link" >CriaDelegadoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaEquipeDto.html" data-type="entity-link" >CriaEquipeDto</a>
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
                                <a href="classes/CriaPartida1653348797091.html" data-type="entity-link" >CriaPartida1653348797091</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaPessoaDto.html" data-type="entity-link" >CriaPessoaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriaTecnicoDto.html" data-type="entity-link" >CriaTecnicoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DelegadoRepository.html" data-type="entity-link" >DelegadoRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/DelegadoRespostaDto.html" data-type="entity-link" >DelegadoRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntidadeBase.html" data-type="entity-link" >EntidadeBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/Equipe.html" data-type="entity-link" >Equipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipeRepository.html" data-type="entity-link" >EquipeRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/EquipeRespostaDto.html" data-type="entity-link" >EquipeRespostaDto</a>
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
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link" >HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/InicializaLigaRespostaDto.html" data-type="entity-link" >InicializaLigaRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LigaRepository.html" data-type="entity-link" >LigaRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/LigaRespostaDto.html" data-type="entity-link" >LigaRespostaDto</a>
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
                                <a href="classes/ListaGinasiosDto.html" data-type="entity-link" >ListaGinasiosDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PartidaRepository.html" data-type="entity-link" >PartidaRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/PartidaRespostaDto.html" data-type="entity-link" >PartidaRespostaDto</a>
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
                                <a href="classes/SnapshotER1652931746184.html" data-type="entity-link" >SnapshotER1652931746184</a>
                            </li>
                            <li class="link">
                                <a href="classes/TecnicoRepository.html" data-type="entity-link" >TecnicoRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/TecnicoRespostaDto.html" data-type="entity-link" >TecnicoRespostaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TemPessoa.html" data-type="entity-link" >TemPessoa</a>
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
                                <a href="interfaces/IClassificacaoGeneratorRequestDto.html" data-type="entity-link" >IClassificacaoGeneratorRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IClassValidatorException.html" data-type="entity-link" >IClassValidatorException</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IException.html" data-type="entity-link" >IException</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITypeORMFilterRequest.html" data-type="entity-link" >ITypeORMFilterRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IValidaNumeroEquipeDto.html" data-type="entity-link" >IValidaNumeroEquipeDto</a>
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