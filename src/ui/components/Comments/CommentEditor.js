import React from "react";

import { connect } from "react-redux";
import { selectors } from "ui/reducers";
import { actions } from "ui/actions";
import { getAvatarColor } from "ui/utils/user";
import classnames from "classnames";

import Dropdown from "devtools/client/debugger/src/components/shared/Dropdown";

class CommentEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: props.comment.contents,
    };
  }

  onChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  onKeyDown = e => {
    if (e.key == "Escape") {
      this.stopEditingComment();
    } else if (e.key == "Enter") {
      this.saveEditedComment(e);
    }
  };

  saveEditedComment = e => {
    const { comment, stopEditing, removeComment } = this.props;
    const { inputValue } = this.state;

    e.stopPropagation();
    stopEditing();

    if (inputValue == "") {
      return removeComment(comment);
    }

    this.props.updateComment({ ...comment, contents: inputValue });
  };

  stopEditingComment = e => {
    const { comment, stopEditing } = this.props;

    this.setState({ inputValue: comment.contents });
    e.stopPropagation();
    stopEditing();
  };

  renderButtons() {
    return (
      <div className="buttons">
        <button className="cancel" onClick={this.stopEditingComment}>
          Cancel
        </button>
        <button className="save" onClick={this.saveEditedComment}>
          Save
        </button>
      </div>
    );
  }

  render() {
    const { comment } = this.props;

    return (
      <div className="editor">
        <textarea
          defaultValue={comment.contents}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
        {this.renderButtons()}
      </div>
    );
  }
}

export default connect(state => ({ currentTime: selectors.getCurrentTime(state) }), {
  updateComment: actions.updateComment,
  removeComment: actions.removeComment,
})(CommentEditor);
