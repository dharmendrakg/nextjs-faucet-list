import { Box, Container, Grid, Typography } from "@mui/material";
import Tab from "@/components/Tab";
import Table from "@/components/Table";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function Index() {
  return (
    <Box style={{ height: "100vh" }}>
      <Header />
      <Container maxWidth="lg">
        <Typography component="h5" variant="h5" sx={{textAlign: "center"}}>
          Expresscrypto All Faucet List
        </Typography>
        <Tab />
        <Table />
      </Container>
      <Footer />
    </Box>
  );
}
