import React from 'react';

import './People.css';

import { Button } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';

class People extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            pageURL: 'https://swapi.co/api/people/',

            pageCount: null,
            pageNum: 1,

            names: [],
        }

        this.handlePageChange = this.handlePageChange.bind(this);
        this.updatePeopleList = this.updatePeopleList.bind(this);
    }

    async fetchPeople(cb) {
        const { pageNum } = this.state
        const peopleUrl = `https://swapi.co/api/people/?page=${pageNum}`
        const response = await fetch(peopleUrl);

        const myJson = await response.json();

        this.setState({
            dataStr: myJson,
        })

        cb(myJson)
    }

    componentDidMount() {
        this.fetchPeople((data) => {
            const pageCount = data['count']
            this.setState({pageCount: pageCount})

            this.updatePeopleList(data)
        })
    }

    updatePeopleList = (data) => {
        const people = data['results']

        const names = people.map((p) => p.name)

        this.setState({names})
    }

    handlePageChange = (event) => {
        const btnText = event.target.innerText

        let { pageCount, pageNum } = this.state

        if (btnText == 'Previous') {
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

        const nameItems = names.map((n, index) =>
            <ListGroupItem key={index.toString()}> {n} </ListGroupItem>
        )

        return (
            <div id={'people-div'}>
                <h2 id={'page-num'}> {`Page ${pageNum}`} </h2>

                <ListGroup id={'people-list'} align={'left'}>
                    {nameItems}
                </ListGroup>

                <div id={'nav-div'}>
                    <form id={'previous-form'} onSubmit={this.handlePageChange}>
                        <Button id="prev-id" data-btn={'prev-page-btn'} margin={'20px'} color="primary">Previous</Button>
                    </form>

                    <form id={'next-form'} onSubmit={this.handlePageChange}>
                        <Button id="next-id" data-btn={'next-page-btn'} margin={'20px'} color="primary">Next</Button>
                    </form>
                </div>
            </div>
        )
    }
}

export default People;

