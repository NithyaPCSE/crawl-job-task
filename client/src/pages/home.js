import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import JobChart from '../components/chart';
import io from "socket.io-client";

const socket = io("http://localhost");

export function Home() {
    const [data, setData] = useState([]);
    const [chartReal, setChartRealtime] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const setChartData = (data) =>{
        let cc_chartReal=JSON.parse(JSON.stringify(chartReal)); //hard onject copy
        if(data.status==='failed'){
            cc_chartReal[3].count=parseInt(cc_chartReal[3].count) + 1;
         }else if(data.status==='in_progress'){
            cc_chartReal[0].count=parseInt(cc_chartReal[0].count) + 1;
         }else if(data.status==='completed'){
            cc_chartReal[1].count=parseInt(cc_chartReal[1].count) + 1;
         }else if(data.status==='enqueued'){
            cc_chartReal[2].count=parseInt(cc_chartReal[2].count) + 1;
         }
        setChartRealtime(cc_chartReal);
    }
    useEffect(() => {
        fetch("/api/job")
            .then(res => res.json())
            .then(d => setData(d.data))
            .catch(error => {
                console.error('There was an error!', error);
            });
        fetch("/api/job/chart")
            .then(res => res.json())
            .then(d => setChartRealtime(d.data))
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log("connected");
        });

        socket.on('disconnect', () => {
            console.log("disconnected");
        });

        socket.on('new-job', (res) => {
            if(res.status){
               setChartData(res);
               let newData=JSON.parse(JSON.stringify(data)); //hard onject copy
               newData.push(res);
               setData(newData);
            }
        });

        socket.on('update-job', (d) => {
            if(d.chart_data.length > 0){
               setChartRealtime(d.chart_data);
            }if(d.output.status && d.output.job_id && d.output.job_id!=''){
                
                let newTableData = JSON.parse(JSON.stringify(data)); //hard onject copy
                newTableData = newTableData.map(job=> {
                    if(job.job_id == d.output.job_id){
                        job.status = d.output.status
                    }
                    return job;
                })
               setData(newTableData);
            }
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('new-job');
        };
    }, [chartReal]);

    const renderStatus = (status) => {
        if (status === 'completed') {
            return <span className="badge text-bg-success text-white">Completed</span>
        } else if (status === 'failed') {
            return <span className="badge text-bg-danger text-white">Failed</span>
        } else if (status === 'enqueued') {
            return <span className="badge text-bg-warning text-white">Enqueued</span>
        }else{
            return <span className="badge text-bg-primary text-white">In Progess</span>
        }
    }

    const RenderData = (event) => {
        let s = event.target.value;
        let url = '/api/job'
        if (s !== '') {
            url = '/api/job/' + s;
        }
        fetch(url)
            .then(res => res.json())
            .then(d => setData(d.data))
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const SaveJobInfo = (e) => {
        e.preventDefault();
        let name = document.getElementById('job_name').value,
            url = document.getElementById('job_url').value;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ job_name: name, job_url: url })
        };
        fetch("/api/job/create", requestOptions)
            .then(res => res.json())
            .then(function (d) {
                if (d.status === 200) {
                    setShow(false);
                }
            }).catch(error => {
                console.error('There was an error!', error);
            });
    }
    return (
        <>
            <div className="row">
                <div className="col-md-7 pb-5">
                    <h2 className="pb-5">Job Information</h2>
                    <JobChart data={chartReal} />
                </div>
                <div className="col-md-3 pb-5">
                    <select className="form-control" onChange={(event) => RenderData(event)}>
                        <option value="">Select All</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="enqueued">Enqueued</option>
                    </select>
                </div>
                <div className="col-md-2 pb-5">
                    <button type="button" className="btn btn-primary float-end" onClick={() => handleShow()}>Create Job</button>
                </div>
                <div className="col-md-12">
                    <div className="card shadow border-0">
                        <div className="card-body">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Job ID</th>
                                        <th scope="col">Job Name</th>
                                        <th scope="col">Job Url</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (data.length > 0) ? data.map((item, index) => {
                                            return <tr key={index}>
                                                <th scope="row">{item.job_id}</th>
                                                <td>{item.job_name}</td>
                                                <td>{item.job_url}</td>
                                                <td className={'job_'+item.job_id}>{renderStatus(item.status)}</td>
                                            </tr>
                                        }) : <tr><td colSpan="4" align="center">No Data Found...</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Form onSubmit={(e) => SaveJobInfo(e)}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="job_name">
                            <Form.Label>Job Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=""
                                required
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="job_url"
                        >
                            <Form.Label>Job Url</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=""
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button type="submit" variant="primary">
                            Save Info
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>

    )
}