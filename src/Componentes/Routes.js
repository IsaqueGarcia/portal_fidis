import React from 'react';
import { Route, Switch, Router } from 'react-router-dom';

import Login from './Login';
import GerenciaOpcoes from './GerenciaOpcoes';
import NaoEncontrado from './NaoEncontrado'
import CriarUsuario from './CriarUsuario'
import GerenciarUsuario from './GerenciarUsuarios'
import CriarPerfil from './CriarPerfil'
import GerenciarPerfil from './GerenciarPerfil'
import CriarPermissao from './CriarPermissao'
import AtualizarUsuario from './AtualizarUsuario'
import AtualizarPerfil from './AtualizarPerfil'
import PrimeiroAcesso from './PrimeiroAcesso'
import {history} from './Historico'
import RotaPrivada from './RotaPrivada'
import EsqueceuSenha from './EsqueceuSenha'
import GerenciaOpcoesUsuario from './GerenciaOpcoesUsuario'


const Routes = () => (
    <Router history={history}>
        <Switch>
            <Route component={Login} exact path="/portalorb/login"></Route>
            <Route component={PrimeiroAcesso} exact path="/portalorb/primeiroacesso"></Route>
            <Route component={EsqueceuSenha} exact path="/portalorb/trocarsenha"></Route>
            
            <RotaPrivada component={GerenciaOpcoesUsuario}  exact path="/portalorb/opcoes/usuario" />
            <RotaPrivada component={GerenciaOpcoes} exact path="/portalorb/home" /> 
            <RotaPrivada component={CriarUsuario} exact path="/portalorb/criar/usuario" />
            <RotaPrivada component={GerenciarUsuario} exact path="/portalorb/gerenciar/usuario" />
            <RotaPrivada component={CriarPerfil} exact path="/portalorb/criar/perfil"/>
            <RotaPrivada component={GerenciarPerfil} exact path="/portalorb/gerenciar/perfil"/>
            <RotaPrivada component={CriarPermissao} exact path="/portalorb/criar/permissao"/>
            <RotaPrivada component={AtualizarUsuario} exact path="/portalorb/atualizar/usuario"/>
            <RotaPrivada component={AtualizarPerfil} exact path="/portalorb/atualizar/perfil"/>
            <Route component={NaoEncontrado}/>
        </Switch>
    </Router>
)

export default Routes;