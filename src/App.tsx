/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { BookDetails } from "./pages/BookDetails";
import { Reader } from "./pages/Reader";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/read/:id" element={<Reader />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
