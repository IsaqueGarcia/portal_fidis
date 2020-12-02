import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import Header from './Header'
import { history } from './Historico'

export default class GerenciaOpcoesUsuario extends React.Component {

    state = {
        permissoes: this.props.location.state.permissoes,
    }
    
    componentDidMount() {
        this.ativarCard()
    }

    ativarCard() {
        if (this.state.permissoes.includes("ADM")) {
            document.querySelectorAll(".containerGerenciaOpcao div").forEach(function (div) {
                var id = div.id
                if (id != "") {
                    document.getElementById(id).style.display = 'block'
                }
            })
        }
        if (!this.state.permissoes.includes("ADM")) {
            document.querySelectorAll(".containerGerenciaOpcao div").forEach((div) => {
                var id = div.id
                if (id != "") {
                    if (this.state.permissoes.includes(id)) {
                        document.getElementById(id).style.display = 'block'
                    }
                }
            })
        }
    }

    setRota(valor) {
        if (valor == 'criarUsuario') {
            history.push('/portalorb/criar/usuario')
        } else if (valor == 'gerenciarUsuario') {
            history.push('/portalorb/gerenciar/usuario')
        } else if (valor == 'criarPerfil') {
            history.push('/portalorb/criar/perfil')
        } else if (valor == 'gerenciarPerfil') {
            history.push('/portalorb/gerenciar/perfil')
        } else if (valor == 'criarPermissao') {
            history.push('/portalorb/criar/permissao')
        }
    }
    
    
    render() {
        return (
            <Fragment>
                <div className="fundo">
                    <Header opcao="Voltar"></Header>
                    <div className="containerGerenciaOpcao">
                        <div id="CRIAR_USUARIO" className="quadroOpcao quadroCriarUsuario" onClick={e => this.setRota('criarUsuario')} >
                            <div className="tituloQuadro"><h5>Criar Usuário</h5></div>
                        </div>
                        <div id="GERENCIAR_USUARIO" className="quadroGerenciarUsuario quadroOpcao" onClick={e => this.setRota('gerenciarUsuario')}>
                            <div className="tituloQuadro"><h5>Gerenciar Usuário</h5></div>
                        </div>
                        <div id="CRIAR_PERFIL" className="quadroCriarPerfil quadroOpcao" onClick={e => this.setRota('criarPerfil')}>
                            <div className="tituloQuadro"><h5>Criar Perfil</h5></div>
                        </div>
                        <div id="GERENCIAR_PERFIL" className="quadroGerenciarPerfil quadroOpcao" onClick={e => this.setRota('gerenciarPerfil')}>
                            <div className="tituloQuadro"><h5>Gerenciar Perfil</h5></div>
                        </div>
                        <div id="CRIAR_PERMISSAO" className="quadroCriarPermissao quadroOpcao" onClick={e => this.setRota('criarPermissao')}>
                            <div className="tituloQuadro"><h5>Criar Permissão</h5></div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}