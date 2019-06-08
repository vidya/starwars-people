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
            nextPageURL: null,
            previousPageURL: null,
            
            pageNum: 1,
            maxPageNum: null,

            names: [],
        }
    }

    async fetchPeople(url, cb) {
        const response = await fetch(url);
        const myJson = await response.json();

        const { next: nextPageURL, previous: previousPageURL } = myJson
        this.setState({ nextPageURL, previousPageURL})

        cb(myJson)
    }

    componentDidMount() {
        this.fetchPeople(this.pageURL, myJson => {
            const { count: peopleCount, results: people } = myJson

            const maxPageNum = Math.ceil(peopleCount / this.pageSize)
            this.setState({ maxPageNum })

            this.updatePeopleList(people)
        })
    }

    updatePeopleList = people => {
        const names = people.map(p => p.name)       
        this.setState({names})
    }

    handlePageChange = event => {
        const btnId = event.currentTarget.dataset.btn
        const { maxPageNum, nextPageURL, previousPageURL } = this.state
        let { pageNum } = this.state

        if ((btnId === 'previous') && (pageNum > 1)){
            pageNum -= 1
        }
        else if ((btnId === 'next') && (pageNum < maxPageNum)){
            pageNum += 1
        }

        const pageURL = (btnId === 'previous') ? previousPageURL : nextPageURL
        this.setState({pageNum}, () => {
            this.fetchPeople(pageURL, ({results: people }) => this.updatePeopleList(people))
        })

        event.preventDefault();
    }

    render() {
        const { pageNum, maxPageNum, names } = this.state
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

                        disabled={pageNum === 1}
                        handlePageChange={this.handlePageChange}
                    />

                    <NavButton
                        id={'next-btn'}
                        btnId={'next'}
                        title={'Next'}

                        disabled={pageNum === maxPageNum}
                        handlePageChange={this.handlePageChange}
                    />
                </Form>
            </div>
        )
    }
}

export default People;

