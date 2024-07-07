import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import { useContext } from "react";
import { AppContext } from "../../App";
import "./Profile.scss";

export default function PersonalProfile() {
    const { isLoggedIn } = useContext(AppContext);
    const genderMap = {
        0: "Men",
        1: "Women"
    };
    const genderDisplay = genderMap[isLoggedIn.account.gender] || "Empty";

    return (
        <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="12" className="mb-4 mb-lg-0">
                        <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                            <MDBRow className="g-0">
                                <MDBCol md="4" className="gradient-custom text-center text-white"
                                    style={{
                                        borderTopLeftRadius: '.5rem',
                                        borderBottomLeftRadius: '.5rem',
                                        backgroundImage: `url(${isLoggedIn.account.image})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        minHeight: '400px',
                                    }}>
                                </MDBCol>
                                <MDBCol md="8" >
                                    <MDBCardBody className="p-4">
                                        <br /><br />
                                        <MDBTypography tag="h6">Information {isLoggedIn.account.name || "Empty"}</MDBTypography>
                                        <hr className="mt-0 mb-4" />
                                        <MDBRow className="pt-1">
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">Email</MDBTypography>
                                                <MDBCardText className="text-muted">{isLoggedIn.account.email || "Empty"}</MDBCardText>
                                            </MDBCol>
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">Phone</MDBTypography>
                                                <MDBCardText className="text-muted">{isLoggedIn.account.phone || "Empty"}</MDBCardText>
                                            </MDBCol>
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">Address</MDBTypography>
                                                <MDBCardText className="text-muted">{isLoggedIn.account.address || "Empty"}</MDBCardText>
                                            </MDBCol>
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">Gender</MDBTypography>
                                                <MDBCardText className="text-muted">{genderDisplay}</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>

                                        <div className="d-flex justify-content-start">
                                            <a href="#!"><MDBIcon fab icon="facebook me-3" size="lg" /></a>
                                            <a href="#!"><MDBIcon fab icon="twitter me-3" size="lg" /></a>
                                            <a href="#!"><MDBIcon fab icon="instagram me-3" size="lg" /></a>
                                        </div>
                                    </MDBCardBody>
                                </MDBCol>
                            </MDBRow>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}
