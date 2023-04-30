import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import React from 'react'

const Recipe = () => {
  let params = useParams();
  const [details, setDetails] = useState({});
  const [activeTab, setActiveTab] = useState('ingredients');

  const fetchDetails = async () => {
    const check = localStorage.getItem(params.name);

    if(check) {
      setDetails(JSON.parse(check));
    }

    else {
      const data = await fetch(`https://api.spoonacular.com/recipes/${params.name}/information?apiKey=${process.env.REACT_APP_API_KEY}`);
      const detailData = await data.json();
      console.log(detailData);
      setDetails(detailData);

      localStorage.setItem(params.name, JSON.stringify(detailData));
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [params.name]);

  return (
    <DetailsWrapper>
      <Header>
        <h2> { details.title } </h2>

        <div>
          <Button className={activeTab === 'ingredients' ? 'active' : ''} onClick={() => setActiveTab("ingredients")}>
            Ingredients
          </Button>
          
          <Button className={activeTab === 'instructions' ? 'active' : ''} onClick={() => setActiveTab("instructions")}>
            Instructions
          </Button>
        </div>
      </Header>

      <RecSummary>
        <img src={details.image} alt="" />
        <p dangerouslySetInnerHTML={{__html: details.summary}} ></p>
      </RecSummary>

      <Info>
        <h3> { activeTab } </h3>
        
        {activeTab === 'ingredients' && details.extendedIngredients && (
        <ul>
          {details.extendedIngredients.map((ingredients) => 
          <li key={ingredients.id}>
            {ingredients.original}
          </li>)}
        </ul>)}
        
        {activeTab === 'instructions' && (
          <div>
            <p dangerouslySetInnerHTML={{__html: details.instructions}} ></p>
          </div>
        )}
      </Info>
    </DetailsWrapper>
  )
}

const DetailsWrapper = styled.div`
  margin-top: 8rem;
  margin-bottom: 5rem;
  .active {
    background: linear-gradient(35deg, #494949, #313131);
    color: white;
  }
  h2 {
    margin-bottom: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  color: #313131;
  background: white;
  border: 2px solid black;
  margin-right: 2rem;
  font-weight: 600;
`;

const RecSummary = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;

  img {
    height: 100%;
  }

  p {
    margin-left: 2.5rem;
    line-height: 1.8rem;
  }
`;

const Info = styled.div`
  h3 {
    text-transform: capitalize;
  }
  li {
    font-size: 1.2rem;
    line-height: 2.2rem;
  }
  ul, ol {
    margin-top: 2rem;
    margin-left: 2rem;
  }
`;

export default Recipe;