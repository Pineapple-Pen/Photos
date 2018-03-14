// currently not functioning

import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';
import Gallery from '../../../lib/react-photo-gallery';

export default class ModalGridView extends React.Component {
  onOpenModal = () => {
    this.props.onOpen();
  };

  onCloseModal = () => {
    this.props.onClose();
  };

  render() {
    return (
      <div className="grid-modal">
        <Modal photos={this.props.images} open={this.props.open} onClose={this.onCloseModal} little>
          <Gallery
            photos={this.props.images}
            columns={2}
          />
        </Modal>
      </div>
    );
  }
}

ModalGridView.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    caption: PropTypes.object.isRequired,
  })).isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
