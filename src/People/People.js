import React from 'react';

import './People.css';

import { Button } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';

const PageNum = (props) => <h2 id={'page-num'}> {`Page ${props.pageNum}`} </h2>

const BtnForm = (props) => (
    <div id={'nav-div'}>
            <form>
                <Button id="prev-id"
                        data-btn={'prev-page-btn'}
                        margin={'20px'} color="primary"

                        onClick={props.handlePageChange}
                >
                    Previous
                </Button>

                <Button id="next-id"
                        data-btn={'next-page-btn'}
                        margin={'120px'} color="primary"

                        onClick={props.handlePageChange}
                >
                    Next
                </Button>

            </form>
    </div>
)


class People extends React.Component {
    constructor(props) {
        super(props)
        this.pageURL = 'https://swapi.co/api/people/'

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
        let { pageCount, pageNum } = this.state

        const btnId = event.currentTarget.dataset.btn
        if (btnId == 'prev-page-btn') {
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
                <PageNum pageNum={pageNum} />

                <ListGroup id={'people-list'} align={'left'}>
                    {nameItems}
                </ListGroup>

                <BtnForm handlePageChange={this.handlePageChange} />
            </div>
        )
    }
}

export default People;

