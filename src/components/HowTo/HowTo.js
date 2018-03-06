import React from 'react';
import './HowTo.css';

class HowTo extends React.Component {

  render() {
    return (
      <div className='container howto'>
        <h1>How To Use Reportilizer <small>to dominate your reports</small></h1>

        <h2>Layout</h2>

        <p>When looking at a report, there should be two tabs: 'Visual Layout' and 'Data
        Source'. The Visual Layout tabis used to create different divisions on the
        report. You can click on the 'Add Box' button to generate a blank box. You
        can then move that box anywhere on the page by selecting a blank spot
        in the center and dragging it to a new location. The boxes will snap to a 10x10
        grid so it should be easy to make your layout line up and look professional.</p>

        <p>Each box will have two icons toward the bottom. The left icon is the 'Edit'
        link and the right icon is the 'Delete' link. If you press the edit icon, a
        modal will appear where you can give a more descriptive name to the box, and
        specify the content and styling of the box. If you click on the delete link,
        a confirm dialog will appear and ask for you to confirm the deletion. Once
        deleted, a box and it's content/style will not be able to be recovered.</p>

        <h3>HTML & CSS</h3>

        <p>The edit modal allows you to enter content and style for each individual
        box. Reportilizer uses HTML and CSS for the content structure and style.
        These two languages are the most basic building blocks of most websites
        and resources to learning and troubleshooting them are abundant on the
        internet.</p>

        <h2>Data Source</h2>

        <p>If you have a JSON blog of data you'd like to enumerate over, you may copy and
        paste the JSON into the textarea and hit 'Update Template' to save it. If you'd
        like to make a request to an external API that supplies JSON, enter in the URL
        and all needed query string params in the box and make sure that the textarea
        is empty.</p>

        <h2>Injecting Data</h2>

        <p>To do the templating of the data, we use doT.js. doT is a small, very fast
        templating language that uses a number of delimiters to inject dynamic data
        into strings of text. Here are a list of the delimters:</p>

        <ul>
          <li><code>{`{{ }}`}</code>	for evaluation</li>
          <li><code>{`{{= }}`}</code> for interpolation</li>
          <li><code>{`{{! }}`}</code>	for interpolation with encoding</li>
          <li><code>{`{{# }}`}</code>	for compile-time evaluation/includes and partials</li>
          <li><code>{`{{## #}}`}</code>	for compile-time defines</li>
          <li><code>{`{{? }}`}</code>	for conditionals</li>
          <li><code>{`{{~ }}`}</code>	for array iteration</li>
        </ul>

        <p>An important thing to note is that everytime you want to reference the data
        that you've loaded in the 'Data Source', you reference the root node as <code>it</code>.
        See examples below. </p>

        <h3>Examples</h3>

        <p>Interpolation with simple strings</p>

        <pre>{`
          {{~it.array :value:index}}
            <div>{{=value}}!</div>
          {{~}}
        `}</pre>

        <p>Conditionals</p>

        <pre>{`
          {{? it.name }}
            <div>Oh, I love your name, {{=it.name}}!</div>
          {{?? it.age === 0}}
            <div>Guess nobody named you yet!</div>
          {{??}}
            You are {{=it.age}} and still don't have a name?
          {{?}}
        `}</pre>

        <p>Looping over arrays</p>

        <pre>{`
          {{~it.array :value:index}}
            <div>{{=value}}!</div>
          {{~}}
        `}</pre>

      </div>
    );
  }
}

export default HowTo;
