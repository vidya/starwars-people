import React from 'react';

import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import Form from "reactstrap/es/Form";

import './People.css';

const PageNum = (props) => <h2 id={'page-num'}> {`Page ${props.pageNum}`} </h2>

const NavButton = (props) => (
    <Button
        id={props.id}
        data-btn={`${props.btnId}`}
        margin={'20px'} color="primary"

        disabled={props.disabled}
        onClick={props.handlePageChange}
    >
        {props.title}
    </Button>
)

class People extends React.Component {
    constructor(props) {
        super(props)

        this.pageURL = 'https://swapi.co/api/people/'
        this.pageSize = 10

        this.state = {
            pageCount: null,
            pageNum: 1,

            names: [],
        }
    }

    async fetchPeople(cb) {
        const { pageNum } = this.state

        const peopleUrl = `${this.pageURL}?page=${pageNum}`
        const response = await fetch(peopleUrl);
        const myJson = await response.json();

        cb(myJson)
    }

    componentDidMount() {
        this.fetchPeople((data) => {
            const pageCount = data['count']
            this.setState({pageCount})

            this.updatePeopleList(data)
        })
    }

    updatePeopleList = ({results: people}) => {
        const names = people.map(p => p.name)
             
        this.setState({names})
    }

    handlePageChange = (event) => {
        const btnId = event.currentTarget.dataset.btn
        let { pageCount, pageNum } = this.state

        if (btnId === 'previous') {
            if (pageNum > 1) {
                pageNum -= 1
            }
        }
        else {
            if ((10 * pageNum) < pageCount) {
                pageNum += 1
            }
        }

        this.setState({pageNum}, () => {
            this.fetchPeople((data) => {
                this.updatePeopleList(data)
            })
        })

        event.preventDefault();
    }

    render() {
        const { pageNum, names } = this.state

        const maxPagenum = Math.ceil(names.length / this.pageSize)
        const prevDisabled = (pageNum === 1)
        const nextDisabled = (names.length < this.pageSize)

        const nameItems = names.map((n, index) =>
            <ListGroupItem key={index.toString()}> {n} </ListGroupItem>
        )

        return (
            <div id={'people-div'}>
                <PageNum pageNum={pageNum} />

                <ListGroup id={'people-list'} align={'left'}>
                    {nameItems}
                </ListGroup>

                <Form>
                    <NavButton
                        id={'previous-btn'}
                        btnId={'previous'}
                        title={'Previous'}

                        disabled={prevDisabled}
                        handlePageChange={this.handlePageChange}
                    />

                    <NavButton
                        id={'next-btn'}
                        btnId={'next'}
                        title={'Next'}

                        disabled={nextDisabled}
                        handlePageChange={this.handlePageChange}
                    />
                </Form>
            </div>
        )
    }
}

export default People;

